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
#include "platformmodel.h"

#include "datamanager.h"
#include "station.h"

struct PlatformModelPrivate {
    Station* station;
};

PlatformModel::PlatformModel(Station* station, QObject* parent)
    : QAbstractListModel(parent) {
    d = new PlatformModelPrivate();
    d->station = station;
}

PlatformModel::~PlatformModel() {
    delete d;
}

QVariant PlatformModel::headerData(int section, Qt::Orientation orientation, int role) const {
    if (role == Qt::DisplayRole) {
        switch (section) {
            case 0:
                return tr("Platform");
            case 1:
                return tr("Destination");
            case 2:
                return tr("ETA");
        }
    }
    return QVariant();
}

int PlatformModel::rowCount(const QModelIndex& parent) const {
    // For list models only the root node (an invalid parent) should return the list's size. For all
    // other (valid) parents, rowCount() should return 0 so that it does not become a tree model.
    if (parent.isValid()) return 0;

    // FIXME: Implement me!
    return d->station->platforms().length();
}

int PlatformModel::columnCount(const QModelIndex& parent) const {
    // For list models only the root node (an invalid parent) should return the list's size. For all
    // other (valid) parents, rowCount() should return 0 so that it does not become a tree model.
    if (parent.isValid()) return 0;

    // FIXME: Implement me!
    return 3;
}

QVariant PlatformModel::data(const QModelIndex& index, int role) const {
    if (!index.isValid())
        return QVariant();

    // FIXME: Implement me!
    if (role == Qt::DisplayRole) {
        QString platform = d->station->platforms().at(index.row());
        switch (index.column()) {
            case 0:
                return platform;
            case 1:
                return DataManager::station(d->station->connection(platform))->stationName();
            case 2:
                return d->station->eta(platform).toString("mm:ss");
        }
    }

    return QVariant();
}

