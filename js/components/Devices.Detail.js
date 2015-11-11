/**
 * Created by Praveen on 20/10/2015.
 */

import React, { PropTypes, Component } from 'react';
import Collapse from 'rc-collapse';


export default class DevicesDetail extends Component {
    constructor(props) {
        super(props)
    }

    hasDeviceKey(obj) {
        const keyName = '_id';
        return obj.hasOwnProperty(keyName);
    }

    //componentDidMount() {
    //    $(document).foundation('accordion', 'reflow');
    //}

    shouldComponentUpdate(nextProps, nextState) {
        const {detailViewDevice} = this.props;
        if(this.hasDeviceKey(detailViewDevice)) {
            let newDetailViewSelectedForDevice = nextProps.detailViewDevice;
            return (detailViewDevice._id !== newDetailViewSelectedForDevice._id);

        } else {
            // No device selected we need to show some informative message
            return true;
        }

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
                categoryField: "date"
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

        let Panel = Collapse.Panel;

        let {dispatch, detailViewDevice} =  this.props;

        if (this.hasDeviceKey(detailViewDevice)) {
            return (
                <div className="small-12 large-9 medium-8 columns ax-detail-content">
                    <div className="row">
                        <div className="large-12 medium-12 columns">
                            <div className="back-button-wrapper" onClick={this.handleMinimizeButtonClick.bind(this)}>
                                <i className="material-icons">chevron_left</i>
                            </div>
                        </div>

                        <div className="large-12 medium-12 columns top-spacer">
                            <Collapse accordion={true} activeKey={['2']} defaultActiveKey={['2']}>
                                <Panel header="Device Info" key="2">
                                    <div>
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
                                </Panel>
                            </Collapse>
                        </div>

                        <div className="large-12 medium-12 columns top-spacer">
                            <Collapse accordion={true} activeKey={['1']} defaultActiveKey={['1']}>
                                <Panel header="Preview" key="1">
                                    <div id="chartdiv"></div>
                                </Panel>
                            </Collapse>
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