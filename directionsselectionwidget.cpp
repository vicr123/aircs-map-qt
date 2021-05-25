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

#include <QToolButton>
#include "datamanager.h"

struct DirectionsSelectionWidgetPrivate {
    QList<StationEntryBox*> extraWaypoints;
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

    for (StationEntryBox* waypointBox : d->extraWaypoints) {
        stations.append(DataManager::stationForName(waypointBox->text()));
    }

    if (stations.contains(nullptr)) return;

    emit findDirections(stations);
}

void DirectionsSelectionWidget::on_departure_textChanged(const QString& arg1) {
    doFindDirections();
}

void DirectionsSelectionWidget::on_destination_textChanged(const QString& arg1) {
    doFindDirections();
}

void DirectionsSelectionWidget::on_addStopButton_clicked() {
    int row = d->extraWaypoints.count();

    StationEntryBox* box = new StationEntryBox(this);
    box->setPlaceholderText(tr("then..."));
    connect(box, &StationEntryBox::textChanged, this, [ = ] {
        doFindDirections();
    });
    d->extraWaypoints.append(box);

    QToolButton* removeButton = new QToolButton();
    removeButton->setSizePolicy(QSizePolicy::Preferred, QSizePolicy::Preferred);
    connect(removeButton, &QToolButton::clicked, this, [ = ] {
        d->extraWaypoints.removeOne(box);
        ui->waypointsLayout->removeWidget(box);
        ui->waypointsLayout->removeWidget(removeButton);

        box->deleteLater();
        removeButton->deleteLater();

        doFindDirections();
    });

    ui->waypointsLayout->addWidget(box, row, 0);
    ui->waypointsLayout->addWidget(removeButton, row, 1);
    box->setFocus();

    doFindDirections();
}

