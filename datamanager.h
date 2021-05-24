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
#ifndef DATAMANAGER_H
#define DATAMANAGER_H

#include <QObject>

class Station;

struct DataManagerPrivate;
class DataManager : public QObject {
        Q_OBJECT
    public:
        static DataManager* instance();

        static QStringList stations();
        static Station* station(QString station);
        static Station* stationForName(QString station);

        static QList<Station*> calculateRoute(QString from, QString to);

    signals:
        void ready();
        void loadError();

    private:
        explicit DataManager(QObject* parent = nullptr);
        DataManagerPrivate* d;
};

#endif // DATAMANAGER_H
