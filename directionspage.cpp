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
#include "directionspage.h"
#include "ui_directionspage.h"

#include "directionsresultsmodel.h"
#include "datamanager.h"
#include "station.h"

struct DirectionsPagePrivate {
    DirectionsResultsModel* resultsModel;
};

#include <QDebug>
DirectionsPage::DirectionsPage(QWidget* parent) :
    QWidget(parent),
    ui(new Ui::DirectionsPage) {
    ui->setupUi(this);

    d = new DirectionsPagePrivate();
    d->resultsModel = new DirectionsResultsModel(this);
    ui->directionsResults->setModel(d->resultsModel);
    ui->directionsResults->setItemDelegate(new DirectionsResultsDelegate(this));

    connect(ui->directionsSelectionWidget, &DirectionsSelectionWidget::findDirections, this, [ = ](QList<Station*> stations) {
        qDebug() << "Finding directions:";
        for (Station* station : stations) {
            qDebug() << station->shortcode();
        }
        qDebug();

        for (int i = 0; i < stations.length() - 1; i++) {
            Station* departure = stations.at(i);
            Station* destination = stations.at(i + 1);

            qDebug() << departure->shortcode() << "->" << destination->shortcode();
            QList<Station*> route = DataManager::calculateRoute(departure->shortcode(), destination->shortcode());
//            for (Station* station : route) {
//                qDebug() << station->shortcode();
//            }

            d->resultsModel->setDirectionsResults(route);
        }
    });
}

DirectionsPage::~DirectionsPage() {
    delete d;
    delete ui;
}
