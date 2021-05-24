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
#include "datagatherer.h"

#include <QMap>
#include <QTimer>

#ifdef Q_OS_WASM
    #include <QNetworkAccessManager>
    #include <QNetworkReply>
#else
    #include <QFile>
#endif

struct DataGathererPrivate {
    static QMap<QString, QByteArray> cached;

    QString path;
};

QMap<QString, QByteArray> DataGathererPrivate::cached = QMap<QString, QByteArray>();

DataGatherer::DataGatherer(QString path, QObject* parent) : QObject(parent) {
    d = new DataGathererPrivate();
    d->path = path;

    if (DataGathererPrivate::cached.contains(path)) {
        QTimer::singleShot(0, [ = ] {
            sendData(DataGathererPrivate::cached.value(path));
        });
        return;
    }

#ifdef Q_OS_WASM
    QNetworkAccessManager* mgr = new QNetworkAccessManager(this);
    QNetworkReply* reply = mgr->get(QNetworkRequest(QUrl(QStringLiteral("/data/%1").arg(path))));
    connect(reply, &QNetworkReply::finished, [ = ] {
        if (reply->error() != QNetworkReply::NoError) {
            emit ready(QByteArray(), true);
            return;
        }

        sendData(reply->readAll());
    });
#else
    QTimer::singleShot(0, [ = ] {
        QFile file(QStringLiteral(":/localdatapack/data/%1").arg(path));
        file.open(QFile::ReadOnly);
        sendData(file.readAll());
    });
#endif
}

DataGatherer::~DataGatherer() {
    delete d;
}

void DataGatherer::sendData(QByteArray data) {
    emit ready(data, false);
    DataGathererPrivate::cached.insert(d->path, data);
    this->deleteLater();
}
