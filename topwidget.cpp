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
#include "topwidget.h"
#include "ui_topwidget.h"

#include <QSvgRenderer>
#include <QPainter>
#include <datamanager.h>
#include "station.h"

TopWidget::TopWidget(QWidget* parent) :
    QWidget(parent),
    ui(new Ui::TopWidget) {
    ui->setupUi(this);

    QPixmap px(QSize(16, 5) * 10);
    px.fill(Qt::transparent);

    QPainter painter(&px);

    QSvgRenderer renderer(QStringLiteral(":/aircslogo.svg"));
    renderer.render(&painter);
    painter.end();

    ui->logoLabel->setPixmap(px);
    ui->logoLabel->setFixedSize(px.size());

    connect(ui->searchEdit, &StationEntryBox::returnPressed, this, [ = ] {
        Station* station = DataManager::stationForName(ui->searchEdit->text());
        if (station) {
            emit focusStation(station->shortcode());
        }
    });
}

TopWidget::~TopWidget() {
    delete ui;
}


void TopWidget::paintEvent(QPaintEvent* event) {
    QWidget::paintEvent(event);

    QPainter painter(this);
    painter.setPen(QColor(100, 100, 100));
    painter.drawLine(0, this->height() - 1, this->width(), this->height() - 1);
}

void TopWidget::on_directionsButton_clicked() {
    emit getDirections();
}

