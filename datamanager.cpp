/****************************************
 *
 *   INSERT-PROJECT-NAME-HERE - INSERT-GENERIC-NAME-HERE
 *   Copyright (C) 2021 Victor Tran
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * *************************************/
#include "datamanager.h"

#include <QJsonObject>
#include <QJsonDocument>
#include "station.h"
#include "datagatherer.h"

struct DataManagerPrivate {
    QMap<QString, Station*> stations;
};

DataManager* DataManager::instance() {
    static DataManager* instance = new DataManager();
    return instance;
}

QStringList DataManager::stations() {
    return instance()->d->stations.keys();
}

Station* DataManager::station(QString station) {
    Q_ASSERT(instance()->d->stations.contains(station));
//    if (!instance()->d->stations.contains(station)) qWarning() << "No station called " << station;
    return instance()->d->stations.value(station);
}

Station* DataManager::stationForName(QString station) {
    if (station.isEmpty()) return nullptr;
    for (Station* s : instance()->d->stations.values()) {
        if (s->stationName() == station) return s;
    }
    return nullptr;
}

QList<Station*> DataManager::calculateRoute(QString from, QString to) {
    struct Node {
        Station* station;
        quint32 distance = UINT32_MAX;
        Station* via = nullptr;
    };

    QList<Node*> nodes;
    QHash<Station*, Node*> stationNodes;

    for (QString station : stations()) {
        Node* n = new Node();
        n->station = DataManager::station(station);
        if (station == from) n->distance = 0;
        nodes.append(n);
        stationNodes.insert(n->station, n);
    }

    while (!nodes.isEmpty()) {
        //Sort the nodes by distance
        std::sort(nodes.begin(), nodes.end(), [ = ](Node * first, Node * second) {
            return first->distance < second->distance;
        });

        //Inspect the stations!
        Node* top = nodes.takeFirst();

        if (top->station->shortcode() == to) {
            QList<Station*> stations;

            if (top->via == nullptr) {
                //Could not find a route!
                qDeleteAll(stationNodes);
                return QList<Station*>();
            }

            //We found it!
            do {
                stations.prepend(top->station);
                top = stationNodes.value(top->via);
            } while (top->via != nullptr);
            stations.prepend(top->station);


            qDeleteAll(stationNodes);
            return stations;
        }

        for (QString platform : top->station->platforms()) {
            Node* connection = stationNodes.value(DataManager::station(top->station->connection(platform)));
            int distance = top->station->distance(platform);

            if (connection->distance > top->distance + distance) {
                connection->distance = top->distance + distance;
                connection->via = top->station;
            }
        }
    }

    qDeleteAll(stationNodes);
    return QList<Station*>();
}

DataManager::DataManager(QObject* parent) : QObject(parent) {
    d = new DataManagerPrivate();

    connect(new DataGatherer("/stations.json"), &DataGatherer::ready, this, [ = ](QByteArray data, bool error) {
        if (error) {
            emit loadError();
            return;
        }

        QJsonObject root = QJsonDocument::fromJson(data).object();
        QJsonObject stations = root.value("stations").toObject();

        for (QString key : stations.keys()) {
            d->stations.insert(key, new Station(key, stations.value(key).toObject()));
        }

        emit ready();
    });
}
