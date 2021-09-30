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
#ifndef DIRECTIONSSELECTIONWIDGET_H
#define DIRECTIONSSELECTIONWIDGET_H

#include <QWidget>
#include "station.h"

namespace Ui {
    class DirectionsSelectionWidget;
}

struct DirectionsSelectionWidgetPrivate;
class DirectionsSelectionWidget : public QWidget {
        Q_OBJECT

    public:
        explicit DirectionsSelectionWidget(QWidget* parent = nullptr);
        ~DirectionsSelectionWidget();

        void pushStation(Station* station);
        void setFromStation(Station* station);
        void setToStation(Station* station);

    signals:
        void findDirections(QList<Station*> waypoints);

    private slots:
        void on_departure_textChanged(const QString& arg1);

        void on_destination_textChanged(const QString& arg1);

        void on_addStopButton_clicked();

    private:
        Ui::DirectionsSelectionWidget* ui;
        DirectionsSelectionWidgetPrivate* d;

        void doFindDirections();
};

#endif // DIRECTIONSSELECTIONWIDGET_H
