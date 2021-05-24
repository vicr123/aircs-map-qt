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
#include "sidebar.h"
#include "ui_sidebar.h"

#include <QPainter>
#include "directionspage.h"
#include "stationpage.h"

Sidebar::Sidebar(QWidget* parent) :
    QWidget(parent),
    ui(new Ui::Sidebar) {
    ui->setupUi(this);
}

Sidebar::~Sidebar() {
    delete ui;
}

void Sidebar::pushStation(QString station) {
    StationPage* stationPage = new StationPage(station);
    stationPage->setFixedWidth(this->width());
    ui->stackedWidget->addWidget(stationPage);
    ui->stackedWidget->setCurrentWidget(stationPage);
}

void Sidebar::pushDirections() {
    DirectionsPage* directions = new DirectionsPage();
    directions->setFixedWidth(this->width());
    ui->stackedWidget->addWidget(directions);
    ui->stackedWidget->setCurrentWidget(directions);
}

void Sidebar::pop() {
    QWidget* w = ui->stackedWidget->widget(ui->stackedWidget->count() - 1);
    ui->stackedWidget->removeWidget(w);
    w->deleteLater();
}

void Sidebar::popIfNotDirections() {
    if (qobject_cast<DirectionsPage*>(ui->stackedWidget->widget(ui->stackedWidget->count() - 1))) return;
    pop();
}

void Sidebar::clear() {
    while (ui->stackedWidget->count() > 1) pop();
}

void Sidebar::paintEvent(QPaintEvent* event) {
    QWidget::paintEvent(event);

    QPainter painter(this);
    painter.setPen(QColor(100, 100, 100));
    painter.drawLine(this->width() - 1, 0, this->width() - 1, this->height() - 1);
}
