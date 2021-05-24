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
#include "station.h"

#include <QDebug>
#include <QPoint>
#include <complex>

struct StationPrivate {
    QString shortcode;
    QString name;
    QPoint coordinates;

    QMap<QString, QString> platformNames;
    QMap<QString, QString> platformDestinations;
    QMap<QString, int> platformDistances;
};

Station::Station(QString shortcode, QJsonObject object, QObject* parent) : QObject(parent) {
    d = new StationPrivate();
    d->shortcode = shortcode;
    d->name = object.value("name").toString();
    d->coordinates = QPoint(object.value("cx").toInt(), object.value("cz").toInt());

    QJsonObject platforms = object.value("platforms").toObject();
    for (QString platform : platforms.keys()) {
        QJsonObject descriptor = platforms.value(platform).toObject();
        d->platformNames.insert(platform, tr("Platform %1").arg(platform));
        d->platformDestinations.insert(platform, descriptor.value("station").toString());
        d->platformDistances.insert(platform, descriptor.value("blocks").toInt());
    }

    qDebug() << "Station added: " << shortcode;
}

QString Station::shortcode() {
    return d->shortcode;
}

QString Station::stationName() {
    return d->name;
}

double Station::birdsEyeDistance(Station* other) {
    std::complex<double> point1(d->coordinates.x(), d->coordinates.y());
    std::complex<double> point2(other->d->coordinates.x(), other->d->coordinates.y());
    std::complex<double> distance = point1 - point2;
    return abs(distance);
    //    return sqrt()
}

QStringList Station::platforms() {
    QStringList plat = d->platformNames.keys();
    std::sort(plat.begin(), plat.end(), [ = ](QString first, QString second) {
        bool ok1, ok2, isFirst;
        isFirst = first.toInt(&ok1) < second.toInt(&ok2);
        if (ok1 && ok2) return isFirst;

        //Fall back to string comparisons
        return first < second;
    });
    return plat;
}

QString Station::platformName(QString platform) {
    return d->platformNames.value(platform);
}

QString Station::connection(QString platform) {
    return d->platformDestinations.value(platform);
}

int Station::distance(QString platform) {
    return d->platformDistances.value(platform);
}

QString Station::platformForConnection(QString connection) {
    return d->platformDestinations.key(connection);
}
