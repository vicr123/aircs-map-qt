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

#include <QApplication>
#include <QFontDatabase>

int main(int argc, char* argv[]) {
    QApplication a(argc, argv);

    QFontDatabase::addApplicationFont(":/Overpass-Regular.ttf");

    a.setFont(QFont("Overpass", 15));

    QPalette pal;
    pal.setColor(QPalette::Window, QColor(255, 255, 255, 200));
    pal.setColor(QPalette::Base, Qt::white);
    pal.setColor(QPalette::WindowText, Qt::black);
    pal.setColor(QPalette::Text, Qt::black);
    a.setPalette(pal);

    MainWidget w;
    w.show();
    return a.exec();
}
