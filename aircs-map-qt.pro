QT       += core gui svg network

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++11

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    datagatherer.cpp \
    datamanager.cpp \
    directionspage.cpp \
    directionsresultsmodel.cpp \
    directionsselectionwidget.cpp \
    main.cpp \
    mainwidget.cpp \
    mapwidget.cpp \
    platformmodel.cpp \
    sidebar.cpp \
    splashwidget.cpp \
    station.cpp \
    stationcompletionmodel.cpp \
    stationentrybox.cpp \
    stationpage.cpp \
    topwidget.cpp

HEADERS += \
    datagatherer.h \
    datamanager.h \
    directionspage.h \
    directionsresultsmodel.h \
    directionsselectionwidget.h \
    mainwidget.h \
    mapwidget.h \
    platformmodel.h \
    sidebar.h \
    splashwidget.h \
    station.h \
    stationcompletionmodel.h \
    stationentrybox.h \
    stationpage.h \
    topwidget.h

FORMS += \
    directionspage.ui \
    directionsselectionwidget.ui \
    mainwidget.ui \
    sidebar.ui \
    splashwidget.ui \
    stationpage.ui \
    topwidget.ui

TRANSLATIONS += \
    translations/vi_VN.ts \
    translations/nl_NL.ts \
    translations/de_DE.ts \
    translations/pt_BR.ts

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

RESOURCES += \
    resources.qrc \
    translations.qrc

!wasm {
    RESOURCES += datapack.qrc
}

OTHER_FILES += data index.html

copydata.commands = $(COPY_DIR) $$PWD/data $$PWD/index.html $$OUT_PWD
first.depends = $(first) copydata
export(first.depends)
export(copydata.commands)
QMAKE_EXTRA_TARGETS += first copydata

DISTFILES += \
    generate-json.js
