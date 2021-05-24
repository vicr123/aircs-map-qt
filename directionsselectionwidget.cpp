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
#include "directionsselectionwidget.h"
#include "ui_directionsselectionwidget.h"

#include "datamanager.h"

struct DirectionsSelectionWidgetPrivate {

};

DirectionsSelectionWidget::DirectionsSelectionWidget(QWidget* parent) :
    QWidget(parent),
    ui(new Ui::DirectionsSelectionWidget) {
    ui->setupUi(this);
    d = new DirectionsSelectionWidgetPrivate();
}

DirectionsSelectionWidget::~DirectionsSelectionWidget() {
    delete ui;
    delete d;
}

void DirectionsSelectionWidget::doFindDirections() {
    QList<Station*> stations;
    stations.append(DataManager::stationForName(ui->departure->text()));
    stations.append(DataManager::stationForName(ui->destination->text()));

    //TODO: waypoints

    if (stations.contains(nullptr)) return;

    emit findDirections(stations);
}

void DirectionsSelectionWidget::on_departure_textChanged(const QString& arg1) {
    doFindDirections();
}

void DirectionsSelectionWidget::on_destination_textChanged(const QString& arg1) {
    doFindDirections();
}

