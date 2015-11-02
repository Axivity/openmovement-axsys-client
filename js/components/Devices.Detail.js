/**
 * Created by Praveen on 20/10/2015.
 */

import React, { PropTypes, Component } from 'react';


export default class DevicesDetail extends Component {
    constructor(props) {
        super(props)
    }

    hasDeviceKey(obj) {
        const keyName = '_id';
        return obj[keyName];
    }

    componentDidMount() {
        $(document).foundation('accordion', 'reflow');
    }

    componentDidUpdate() {
        const {detailViewDevice} = this.props;

        if(this.hasDeviceKey(detailViewDevice)) {
            this.drawChart();
        }
    }

    handleMinimizeButtonClick(ev) {
        console.log('clicked');
        var innerText = $('.back-button-wrapper > i').text();
        console.log(innerText);
        if(innerText === 'chevron_left') {
            $('.back-button-wrapper > i').text('chevron_right');

            $(".slide").animate({width:'toggle'},100, 'linear', () => {
                $('.ax-detail-content').removeClass('large-8');
                $('.ax-detail-content').addClass('large-12');
            });


        } else {
            $('.back-button-wrapper > i').text('chevron_left');

            $(".slide").animate({width:'toggle'},100, 'linear', () => {
                $('.ax-detail-content').removeClass('large-12');
                $('.ax-detail-content').addClass('large-8');
            });

        }
    }

    drawChart() {
        var chartData = [];
        generateChartData();

        function generateChartData() {
            var firstDate = new Date( 2012, 0, 1 );
            firstDate.setDate( firstDate.getDate() - 500 );
            firstDate.setHours( 0, 0, 0, 0 );

            for ( var i = 0; i < 500; i++ ) {
                var newDate = new Date( firstDate );
                newDate.setDate( newDate.getDate() + i );

                var a = Math.round( Math.random() * ( 40 + i ) ) + 100 + i;
                var b = Math.round( Math.random() * 100000000 );

                chartData.push( {
                    date: newDate,
                    value: a,
                    volume: b
                } );
            }
        }

        var chart = AmCharts.makeChart( "chartdiv", {
            type: "stock",
            "theme": "dark",
            dataSets: [ {
                color: "#b0de09",
                fieldMappings: [ {
                    fromField: "value",
                    toField: "value"
                }, {
                    fromField: "volume",
                    toField: "volume"
                } ],
                dataProvider: chartData,
                categoryField: "date",
                // EVENTS
                stockEvents: [ {
                    date: new Date( 2010, 8, 19 ),
                    type: "sign",
                    backgroundColor: "#85CDE6",
                    graph: "g1",
                    text: "S",
                    description: "This is description of an event"
                }, {
                    date: new Date( 2010, 10, 19 ),
                    type: "flag",
                    backgroundColor: "#FFFFFF",
                    backgroundAlpha: 0.5,
                    graph: "g1",
                    text: "F",
                    description: "Some longerntext can alson be added"
                }, {
                    date: new Date( 2010, 11, 10 ),
                    showOnAxis: true,
                    backgroundColor: "#85CDE6",
                    type: "pin",
                    text: "X",
                    graph: "g1",
                    description: "This is description of an event"
                }, {
                    date: new Date( 2010, 11, 26 ),
                    showOnAxis: true,
                    backgroundColor: "#85CDE6",
                    type: "pin",
                    text: "Z",
                    graph: "g1",
                    description: "This is description of an event"
                }, {
                    date: new Date( 2011, 0, 3 ),
                    type: "sign",
                    backgroundColor: "#85CDE6",
                    graph: "g1",
                    text: "U",
                    description: "This is description of an event"
                }, {
                    date: new Date( 2011, 1, 6 ),
                    type: "sign",
                    graph: "g1",
                    text: "D",
                    description: "This is description of an event"
                }, {
                    date: new Date( 2011, 3, 5 ),
                    type: "sign",
                    graph: "g1",
                    text: "L",
                    description: "This is description of an event"
                }, {
                    date: new Date( 2011, 3, 5 ),
                    type: "sign",
                    graph: "g1",
                    text: "R",
                    description: "This is description of an event"
                }, {
                    date: new Date( 2011, 5, 15 ),
                    type: "arrowUp",
                    backgroundColor: "#00CC00",
                    graph: "g1",
                    description: "This is description of an event"
                }, {
                    date: new Date( 2011, 6, 25 ),
                    type: "arrowDown",
                    backgroundColor: "#CC0000",
                    graph: "g1",
                    description: "This is description of an event"
                }, {
                    date: new Date( 2011, 8, 1 ),
                    type: "text",
                    graph: "g1",
                    text: "Longer text can\nalso be displayed",
                    description: "This is description of an event"
                } ]
            } ],


            panels: [ {
                title: "Value",
                percentHeight: 70,

                stockGraphs: [ {
                    id: "g1",
                    valueField: "value"
                } ],

                stockLegend: {
                    valueTextRegular: " ",
                    markerType: "none"
                }
            } ],

            chartScrollbarSettings: {
                graph: "g1"
            },

            chartCursorSettings: {
                valueBalloonsEnabled: true,
                graphBulletSize: 1,
                valueLineBalloonEnabled: true,
                valueLineEnabled: true,
                valueLineAlpha: 0.5
            },

            periodSelector: {
                periods: [ {
                    period: "DD",
                    count: 10,
                    label: "10 days"
                }, {
                    period: "MM",
                    count: 1,
                    label: "1 month"
                }, {
                    period: "YYYY",
                    count: 1,
                    label: "1 year"
                }, {
                    period: "YTD",
                    label: "YTD"
                }, {
                    period: "MAX",
                    label: "MAX"
                } ]
            },

            panelsSettings: {
                usePrefixes: true
            },
            "export": {
                "enabled": true
            }
        } );
    }

    render() {
        let {dispatch, detailViewDevice} =  this.props;

        if (this.hasDeviceKey(detailViewDevice)) {
            return (
                <div className="small-12 large-8 medium-7 columns ax-detail-content">
                    <div className="row">
                        <div className="large-12 medium-12 columns">
                            <div className="back-button-wrapper" onClick={this.handleMinimizeButtonClick.bind(this)}>
                                <i className="material-icons">chevron_left</i>
                            </div>
                        </div>

                        <div className="large-12 medium-12 columns">
                            <ul className="accordion ax-detail-panels" data-accordion>
                                <li className="accordion-navigation">
                                    <a href="#panel1a"><strong>Device Info</strong></a>
                                    <div id="panel1a" className="content active">
                                        <h6>Metadata</h6>
                                        <div className="row">
                                            <div className="large-6 medium-6 small-6 columns">
                                                Gender:
                                            </div>
                                            <div className="large-6 medium-6 small-6 columns">
                                                Male
                                            </div>
                                            <div className="large-6 medium-6 small-6 columns">
                                                Age:
                                            </div>
                                            <div className="large-6 medium-6 small-6 columns">
                                                45
                                            </div>
                                        </div>

                                        <h6>Attributes</h6>
                                        <div className="row">
                                            <div className="large-6 medium-6 small-6 columns">
                                                Port:
                                            </div>
                                            <div className="large-6 medium-6 small-6 columns">
                                                {detailViewDevice.port}
                                            </div>
                                            <div className="large-6 medium-6 small-6 columns">
                                                Volume:
                                            </div>
                                            <div className="large-6 medium-6 small-6 columns">
                                                {detailViewDevice.volumePath}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li className="accordion-navigation">
                                    <a href="#panel1a"><strong>Preview</strong></a>
                                    <div id="panel1a" className="content active">
                                        <div id="chartdiv"></div>
                                    </div>
                                </li>
                            </ul>
                        </div>


                    </div>
                </div>
            );
        } else {
            return (
                <div className="small-12 large-8 medium-7 columns ax-detail-content">
                    <div className="row">
                        {/*
                        <div className="large-12 medium-12 columns">
                            <div className="back-button-wrapper">
                                <i className="material-icons">chevron_left</i>
                            </div>
                        </div>
                         */}
                        <div className="large-12 medium-12 columns device-details-section-main">
                            <span className="">
                                <h4 className="device-details-main-msg"> No devices selected, select a device to view more details </h4>
                            </span>
                        </div>
                    </div>
                </div>
            );
        }


    }
}