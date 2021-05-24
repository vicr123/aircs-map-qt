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
#include "directionsresultsmodel.h"

#include <QPainter>
#include "station.h"

struct DirectionsResultsModelPrivate {
    QList<Station*> stations;
};

DirectionsResultsModel::DirectionsResultsModel(QObject* parent)
    : QAbstractListModel(parent) {
    d = new DirectionsResultsModelPrivate();
}

DirectionsResultsModel::~DirectionsResultsModel() {
    delete d;
}

void DirectionsResultsModel::setDirectionsResults(QList<Station*> stations) {
    d->stations = stations;
    emit dataChanged(index(0), index(rowCount()));
}

int DirectionsResultsModel::rowCount(const QModelIndex& parent) const {
    // For list models only the root node (an invalid parent) should return the list's size. For all
    // other (valid) parents, rowCount() should return 0 so that it does not become a tree model.
    if (parent.isValid())
        return 0;

    return d->stations.length();
}

QVariant DirectionsResultsModel::data(const QModelIndex& index, int role) const {
    if (!index.isValid())
        return QVariant();

    Station* before = nullptr, *after = nullptr;
    if (index.row() != 0) before = d->stations.value(index.row() - 1);
    Station* s = d->stations.value(index.row());
    if (index.row() != d->stations.length() - 1) after = d->stations.value(index.row() + 1);
    if (!s) return QVariant();

    if (role == Qt::DisplayRole) {
        return s->stationName();
    } else if (role == SecondaryTextRole) {
        if (after) {
            return tr("Take Platform %1").arg(s->platformForConnection(after->shortcode()));
        } else {
            return tr("Arrive at the destination");
        }
    }
    return QVariant();
}


DirectionsResultsDelegate::DirectionsResultsDelegate(QObject* parent) {

}

void DirectionsResultsDelegate::paint(QPainter* painter, const QStyleOptionViewItem& option, const QModelIndex& index) const {
    QRect titleRect = option.rect;
    titleRect.setLeft(9);
    titleRect.moveTop(titleRect.top() + 9);
    titleRect.setHeight(QFontMetrics(titleFont(option.font)).height());

    painter->setFont(titleFont(option.font));
    painter->drawText(titleRect, index.data(Qt::DisplayRole).toString());

    QRect textRect = titleRect;
    textRect.moveTop(textRect.bottom());
    textRect.setHeight(QFontMetrics(option.font).height());

    painter->setFont(option.font);
    painter->drawText(textRect, index.data(DirectionsResultsModel::SecondaryTextRole).toString());
}

QSize DirectionsResultsDelegate::sizeHint(const QStyleOptionViewItem& option, const QModelIndex& index) const {
    QSize size(300, 18);
    size.rheight() += QFontMetrics(titleFont(option.font)).height();
    size.rheight() += QFontMetrics(option.font).height();
    return size;
}

QFont DirectionsResultsDelegate::titleFont(QFont base) const {
    QFont titleFont = base;
    titleFont.setBold(true);
    titleFont.setPointSize(25);
    return titleFont;
}
