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
#ifndef DIRECTIONSRESULTSMODEL_H
#define DIRECTIONSRESULTSMODEL_H

#include <QAbstractListModel>
#include <QStyledItemDelegate>

struct DirectionsResultsModelPrivate;
class Station;
class DirectionsResultsModel : public QAbstractListModel {
        Q_OBJECT

    public:
        explicit DirectionsResultsModel(QObject* parent = nullptr);
        ~DirectionsResultsModel();

        enum Roles {
            SecondaryTextRole = Qt::UserRole,
            StationTokenSizeRole,
            ConnectionsRole,
            BeforeLineColorRole,
            AfterLineColorRole
        };

        void setDirectionsResults(QList<Station*> stations);

        // Basic functionality:
        int rowCount(const QModelIndex& parent = QModelIndex()) const override;
        QVariant data(const QModelIndex& index, int role = Qt::DisplayRole) const override;

    private:
        DirectionsResultsModelPrivate* d;
};

class DirectionsResultsDelegate : public QStyledItemDelegate {
        Q_OBJECT
    public:
        explicit DirectionsResultsDelegate(QObject* parent = nullptr);

        // QAbstractItemDelegate interface
    public:
        void paint(QPainter* painter, const QStyleOptionViewItem& option, const QModelIndex& index) const;
        QSize sizeHint(const QStyleOptionViewItem& option, const QModelIndex& index) const;

        QFont titleFont(QFont base) const;
};

#endif // DIRECTIONSRESULTSMODEL_H
