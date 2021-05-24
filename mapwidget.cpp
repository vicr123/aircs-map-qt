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
#include "mapwidget.h"

#include <QPainter>
#include <QSvgRenderer>
#include <QMouseEvent>
#include <QVariantAnimation>
#include "datamanager.h"
#include "datagatherer.h"

struct MapWidgetPrivate {
    QSvgRenderer renderer;
//    double zoom = 1;
//    QPoint offset;

    QVariantAnimation* boundsAnim;

    bool dragging = false;
    QPoint dragStart;
    QPoint dragInitial;

    QString pointedStation;
};

MapWidget::MapWidget(QWidget* parent) : QWidget(parent) {
    this->setMouseTracking(true);

    d = new MapWidgetPrivate();
    connect(new DataGatherer("/map.svg"), &DataGatherer::ready, this, [ = ](QByteArray data, bool error) {
        if (error) {
            emit loadError();
            return;
        }

        d->renderer.load(data);

        QRectF initialAnim;
        initialAnim.setSize(d->renderer.boundsOnElement("map").size() * 30);
        d->boundsAnim->setStartValue(initialAnim);
        d->boundsAnim->setEndValue(initialAnim);
        d->boundsAnim->setEasingCurve(QEasingCurve::OutCubic);

        connect(d->boundsAnim, &QVariantAnimation::valueChanged, this, [ = ] {
            this->update();
        });
        connect(d->boundsAnim, &QVariantAnimation::finished, this, [ = ] {
            this->update();
        });

        emit ready();
    });

    d->boundsAnim = new QVariantAnimation();

}

MapWidget::~MapWidget() {
    delete d;
}

QRectF MapWidget::toWidgetCoords(QRectF svgCoords) {
    QRectF renderRect = d->boundsAnim->currentValue().toRectF();
//    double zoom = renderRect.size().width() / d->renderer.viewBox().width();
    double zoom = renderRect.size().width() / d->renderer.boundsOnElement("map").width();
    svgCoords.setSize(svgCoords.size() * zoom);
    svgCoords.moveTopLeft(svgCoords.topLeft() * zoom + renderRect.topLeft());
    return svgCoords;
}

#include <QDebug>
QPointF MapWidget::toSvgCoords(QPointF widgetCoords) {
    qDebug() << d->renderer.boundsOnElement("map");
    QRectF renderRect = d->boundsAnim->currentValue().toRectF();
//    double zoom = renderRect.size().width() / d->renderer.viewBox().width();
    double zoom = renderRect.size().width() / d->renderer.boundsOnElement("map").width();
    widgetCoords = widgetCoords - renderRect.topLeft() / zoom;
    return widgetCoords;
}

QRectF MapWidget::stationCoords(QString station) {
    return toWidgetCoords(d->renderer.transformForElement(station).map(d->renderer.boundsOnElement(station)).boundingRect());
}

void MapWidget::mousePressEvent(QMouseEvent* event) {
    d->dragging = true;
    d->dragStart = event->globalPos();
    d->dragInitial = event->globalPos();
}

void MapWidget::mouseReleaseEvent(QMouseEvent* event) {
    if (d->dragging) {
        d->dragging = false;
        if ((d->dragInitial - d->dragStart).manhattanLength() < 5) {
            //Treat this as a click!
            if (d->pointedStation.isEmpty()) {
                emit emptyClick();
            } else {
                emit stationClicked(d->pointedStation);
            }
        }
    }
}

void MapWidget::mouseMoveEvent(QMouseEvent* event) {
    if (d->dragging) {
//        d->offset += event->globalPos() - d->dragStart;
        QRectF newOffset = d->boundsAnim->currentValue().toRectF();
        newOffset.moveTopLeft(newOffset.topLeft() + event->globalPos() - d->dragStart);
        d->boundsAnim->setStartValue(newOffset);
        d->boundsAnim->setEndValue(newOffset);
        d->dragStart = event->globalPos();

        this->update();
    } else {
        //Figure out what we're on
        d->pointedStation = "";
        for (const QString& station : DataManager::instance()->stations()) {
            if (stationCoords(station).contains(event->pos())) {
                d->pointedStation = station;
                break;
            }
        }

        if (d->pointedStation.isEmpty()) {
            this->setCursor(QCursor(Qt::ArrowCursor));
        } else {
            this->setCursor(QCursor(Qt::PointingHandCursor));
        }
    }
}

void MapWidget::keyPressEvent(QKeyEvent* event) {
}

void MapWidget::keyReleaseEvent(QKeyEvent* event) {
}

void MapWidget::paintEvent(QPaintEvent* event) {
    QPainter painter(this);
    painter.setBrush(Qt::white);
    painter.setPen(Qt::transparent);
    painter.drawRect(0, 0, this->width(), this->height());

//    QRect renderRect;
//    renderRect.setSize(d->renderer.viewBox().size() * 30 * d->zoom);
//    renderRect.moveTopLeft(d->offset);
    d->renderer.render(&painter, "map", d->boundsAnim->currentValue().toRectF());

    painter.setBrush(QColor(255, 0, 0, 50));
//    for (QString station : DataManager::stations()) {
//        painter.drawRect(stationCoords(station));
//    }
//    painter.drawRect(stationCoords("WC"));
//    painter.drawRect(stationCoords("WCC"));
}


void MapWidget::wheelEvent(QWheelEvent* event) {
//    d->zoom += 0.01 * (event->angleDelta().y() / 8.0);

    double factor = 1.0 + 10 * (event->angleDelta().y() / 12000.0);

    QRectF renderRect = d->boundsAnim->endValue().toRectF();
    QPointF initialPoint = toSvgCoords(event->position());

    QPointF offset = initialPoint - (initialPoint * factor);

    renderRect.setSize(renderRect.size() * factor);
    renderRect.translate(offset);


    d->boundsAnim->setStartValue(d->boundsAnim->currentValue());
    d->boundsAnim->setEndValue(renderRect);
    d->boundsAnim->setDuration(200);
    d->boundsAnim->start();
}
