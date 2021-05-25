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

    switch (role) {
        case Qt::DisplayRole:
            return s->stationName();
        case SecondaryTextRole:
            if (after) {
                if (after == s) {
                    return tr("Arrive at the waypoint");
                } else {
                    return tr("Take Platform %1").arg(s->platformForConnection(after->shortcode()));
                }
            } else {
                return tr("Arrive at the destination");
            }
        case StationTokenSizeRole:
            return QSize(16, 16);
        case ConnectionsRole: {
            uint connections = 0;
            if (before && before != s) connections |= 0x1;
            if (after && after != s) connections |= 0x2;
            return connections;
        }
        case BeforeLineColorRole:
            return QColor(Qt::black);
        case AfterLineColorRole:
            return QColor(Qt::black);
    }

    return QVariant();
}


DirectionsResultsDelegate::DirectionsResultsDelegate(QObject* parent) {

}

void DirectionsResultsDelegate::paint(QPainter* painter, const QStyleOptionViewItem& option, const QModelIndex& index) const {
    QRect indicatorRect = option.rect;
    indicatorRect.moveLeft(9);
    indicatorRect.setWidth(24);

    painter->setRenderHint(QPainter::Antialiasing);

    uint connections = index.data(DirectionsResultsModel::ConnectionsRole).toUInt();
    if (connections & 0x1) {
        QRect lineRect = indicatorRect;
        lineRect.setWidth(12);
        lineRect.moveCenter(indicatorRect.center());
        lineRect.setBottom(indicatorRect.center().y());

        painter->setPen(Qt::transparent);
        painter->setBrush(index.data(DirectionsResultsModel::BeforeLineColorRole).value<QColor>());
        painter->drawRect(lineRect);
    }
    if (connections & 0x2) {
        QRect lineRect = indicatorRect;
        lineRect.setWidth(12);
        lineRect.moveCenter(indicatorRect.center());
        lineRect.setTop(indicatorRect.center().y());
        lineRect.setBottom(indicatorRect.bottom());

        painter->setPen(Qt::transparent);
        painter->setBrush(index.data(DirectionsResultsModel::BeforeLineColorRole).value<QColor>());
        painter->drawRect(lineRect);
    }

    QRect stationRect;
    stationRect.setSize(index.data(DirectionsResultsModel::StationTokenSizeRole).toSize());
    stationRect.moveCenter(indicatorRect.center());

    painter->setPen(QPen(Qt::black, 8));
    painter->setBrush(Qt::white);
    painter->drawRoundedRect(stationRect, 8, 8);

    painter->setPen(option.palette.color(QPalette::WindowText));

    QRect titleRect = option.rect;
    titleRect.setLeft(indicatorRect.right() + 9);
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
