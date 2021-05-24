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
#include "stationcompletionmodel.h"

#include "datamanager.h"
#include "station.h"

StationCompletionModel::StationCompletionModel(QObject* parent)
    : QAbstractListModel(parent) {
}

int StationCompletionModel::rowCount(const QModelIndex& parent) const {
    // For list models only the root node (an invalid parent) should return the list's size. For all
    // other (valid) parents, rowCount() should return 0 so that it does not become a tree model.
    if (parent.isValid())
        return 0;

    // FIXME: Implement me!
    return DataManager::stations().length();
}

QVariant StationCompletionModel::data(const QModelIndex& index, int role) const {
    if (!index.isValid())
        return QVariant();

    // FIXME: Implement me!
    QString station = DataManager::stations().value(index.row());
    if (role == Qt::EditRole) {
        return QStringLiteral("%1 (%2)").arg(DataManager::station(station)->stationName(), station);
    } else if (role == Qt::DisplayRole) {
        return DataManager::station(station)->stationName();
    } else if (role == Qt::UserRole) {
        return DataManager::station(station)->stationName();
    }
    return QVariant();
}
