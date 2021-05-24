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
#include "stationpage.h"
#include "ui_stationpage.h"

#include <QDebug>
#include "platformmodel.h"
#include "station.h"
#include "datagatherer.h"
#include "datamanager.h"

StationPage::StationPage(QString station, QWidget* parent) :
    QWidget(parent),
    ui(new Ui::StationPage) {
    ui->setupUi(this);

    ui->sep->setFixedHeight(5);
    ui->sep->setAutoFillBackground(true);

    QPalette pal;
    pal.setColor(QPalette::Window, QColor(200, 0, 0));
    ui->sep->setPalette(pal);

    connect(new DataGatherer("1920x1080.png"), &DataGatherer::ready, this, [ = ](QByteArray data) {
        QPixmap pic;
        pic.loadFromData(data);
        ui->pictureLabel->setFixedHeight(pic.size().scaled(this->size(), Qt::KeepAspectRatio).height());
        ui->pictureLabel->setPixmap(pic);
    });

    Station* s = DataManager::station(station);
    ui->stationName->setText(s->stationName());
    ui->platformData->setModel(new PlatformModel(s));

    ui->platformData->header()->setStretchLastSection(false);
    ui->platformData->header()->setSectionResizeMode(0, QHeaderView::ResizeToContents);
    ui->platformData->header()->setSectionResizeMode(1, QHeaderView::Stretch);
    ui->platformData->header()->setSectionResizeMode(2, QHeaderView::ResizeToContents);
}

StationPage::~StationPage() {
    delete ui;
}

void StationPage::resizeEvent(QResizeEvent* event) {
    connect(new DataGatherer("1920x1080.png"), &DataGatherer::ready, this, [ = ](QByteArray data) {
        QPixmap pic;
        pic.loadFromData(data);
        ui->pictureLabel->setFixedHeight(pic.size().scaled(this->size(), Qt::KeepAspectRatio).height());
        ui->pictureLabel->setPixmap(pic);
    });
}
