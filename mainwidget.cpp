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
#include "mainwidget.h"
#include "ui_mainwidget.h"

#include <QVariantAnimation>
#include "directionspage.h"
#include "mapwidget.h"
#include "sidebar.h"
#include "splashwidget.h"
#include "datamanager.h"

const int SIDEBAR_WIDTH = 500;

struct MainWidgetPrivate {
    MapWidget* map;
    Sidebar* sidebar;
    bool sidebarVisible = false;

    SplashWidget* splash;
    int readyCount = 0;
};

MainWidget::MainWidget(QWidget* parent)
    : QWidget(parent)
    , ui(new Ui::MainWidget) {
    ui->setupUi(this);
    d = new MainWidgetPrivate();

    d->map = new MapWidget();
    d->map->setParent(this);
    d->map->move(0, 0);
    d->map->lower();

    d->sidebar = new Sidebar();
    d->sidebar->setParent(this);
    d->sidebar->setFixedWidth(SIDEBAR_WIDTH);
    d->sidebar->move(-d->sidebar->width(), ui->topWidget->height());

    connect(d->map, &MapWidget::stationClicked, this, [ = ](QString station) {
        if (d->sidebar->topDirections() && d->sidebarVisible) {
            d->sidebar->topDirections()->pushStation(DataManager::station(station));
        } else {
            d->sidebar->pushStation(station);
            showSidebar();
        }
    });
    connect(d->map, &MapWidget::emptyClick, this, [ = ] {
        hideSidebar();
    });
    connect(d->map, &MapWidget::directions, this, [ = ](QString station, bool from) {
        if (!d->sidebar->topDirections()) d->sidebar->pushDirections();
        showSidebar();
        if (from) {
            d->sidebar->topDirections()->setFromStation(DataManager::station(station));
        } else {
            d->sidebar->topDirections()->setToStation(DataManager::station(station));
        }
    });

    d->splash = new SplashWidget(this);
    d->splash->move(0, 0);
    d->splash->resize(this->size());
    d->splash->show();
    d->splash->raise();

    auto readyHandler = [ = ] {
        d->readyCount++;
        if (d->readyCount == 2) d->splash->hide();
    };
    auto errorHandler = [ = ] {

    };

    connect(d->map, &MapWidget::ready, this, readyHandler);
    connect(d->map, &MapWidget::loadError, this, errorHandler);
    connect(DataManager::instance(), &DataManager::ready, this, readyHandler);
    connect(DataManager::instance(), &DataManager::loadError, this, errorHandler);

    connect(ui->topWidget, &TopWidget::getDirections, this, [ = ] {
        d->sidebar->pushDirections();
        showSidebar();
    });
    connect(ui->topWidget, &TopWidget::focusStation, this, [ = ](QString station) {
        d->sidebar->pushStation(station);
        showSidebar();
    });
}

MainWidget::~MainWidget() {
    delete d;
    delete ui;
}

void MainWidget::showSidebar() {
    QVariantAnimation* anim = new QVariantAnimation();
    anim->setStartValue(d->sidebar->geometry().topLeft());
    anim->setEndValue(QPoint(0, ui->topWidget->height()));
    anim->setEasingCurve(QEasingCurve::OutCubic);
    anim->setDuration(500);
    connect(anim, &QVariantAnimation::valueChanged, this, [ = ](QVariant value) {
        d->sidebar->move(value.toPoint());
    });
    connect(anim, &QVariantAnimation::finished, anim, &QVariantAnimation::deleteLater);
    anim->start();
    d->sidebarVisible = true;
}

void MainWidget::hideSidebar() {
    QVariantAnimation* anim = new QVariantAnimation();
    anim->setStartValue(d->sidebar->geometry().topLeft());
    anim->setEndValue(QPoint(-d->sidebar->width(), ui->topWidget->height()));
    anim->setEasingCurve(QEasingCurve::OutCubic);
    anim->setDuration(500);
    connect(anim, &QVariantAnimation::valueChanged, this, [ = ](QVariant value) {
        d->sidebar->move(value.toPoint());
    });
    connect(anim, &QVariantAnimation::finished, anim, &QVariantAnimation::deleteLater);
    anim->start();
    d->sidebarVisible = false;
}

void MainWidget::resizeEvent(QResizeEvent* event) {
    d->map->resize(this->size());
    d->sidebar->resize(d->sidebar->width(), this->height() - ui->topWidget->height());
    d->sidebar->move(d->sidebar->x(), ui->topWidget->height());
    d->splash->resize(this->size());
}
