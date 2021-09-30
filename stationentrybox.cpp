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
#include "stationentrybox.h"

#include <QCompleter>
#include <QAbstractItemView>
#include "stationcompletionmodel.h"

struct StationEntryBoxPrivate {
    QCompleter* completer;
};

StationEntryBox::StationEntryBox(QWidget* parent) : QLineEdit(parent) {
    d = new StationEntryBoxPrivate();
    QCompleter* completer = new QCompleter(new StationCompletionModel(this), this);
    completer->setCaseSensitivity(Qt::CaseInsensitive);
    completer->setCompletionRole(Qt::EditRole);
    completer->setFilterMode(Qt::MatchContains);
    completer->setWidget(this);

    connect(completer, QOverload<const QModelIndex&>::of(&QCompleter::highlighted), [ = ](const QModelIndex & index) {
        if (index.isValid()) {
            this->setText(index.data(Qt::UserRole).toString());
        } else {
            this->setText(completer->completionPrefix());
        }
    });
    connect(completer, QOverload<const QModelIndex&>::of(&QCompleter::activated), [ = ](const QModelIndex & index) {
        if (index.isValid()) {
            this->setText(index.data(Qt::UserRole).toString());
        }
    });
    connect(this, &StationEntryBox::textEdited, this, [ = ] {
        completer->setCompletionPrefix(this->text());
        completer->complete();
    });
    connect(this, &StationEntryBox::returnPressed, this, [ = ] {
        if (completer->currentRow() == -1 && !completer->setCurrentRow(0)) {
            this->setText("");
        } else {
            this->setText(completer->currentIndex().data(Qt::UserRole).toString());
        }
    });

    d->completer = completer;
}

StationEntryBox::~StationEntryBox() {
    delete d;
}


void StationEntryBox::focusOutEvent(QFocusEvent* event) {
    QLineEdit::focusOutEvent(event);

    if (this->text() == "") return;
    if (!d->completer->popup()->isVisible()) return;

    if (!d->completer->popup()->currentIndex().isValid()) {
        if (d->completer->setCurrentRow(0)) d->completer->currentIndex().data(Qt::UserRole).toString();
    } else {
        this->setText(d->completer->popup()->currentIndex().data(Qt::UserRole).toString());
    }
}
