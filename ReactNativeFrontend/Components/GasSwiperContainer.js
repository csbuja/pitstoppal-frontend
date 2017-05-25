'use strict';

var GasFoodSwiperContainer = require('./GasFoodSwiperContainer');
var React = require('react-native');
var SwiperContainerMixin = require('../Mixins/SwiperContainerMixin');
var TimerMixin = require('react-native-timer-mixin');

var {StyleSheet, Text, View,Image,Switch} = React;

var GasSwiperContainer = React.createClass({
    
    getInitialState:function(){
            return {
                sortGasByPrice: true,
                MAX_NUMBER_GAS_STATIONS_IN_PRICE_MODE: 150
            }
    },
    mixins: [TimerMixin, SwiperContainerMixin({ isFoodSwiper: false})],

    render: function() {
        var yelpImage = (<Image source={require("../Images/yelp-2c.png")} style={{height:20,width:1.7*20}}/>)
        var self = this;
        var salmon = '#FF3366'
        
    
        return (
            <View>
                <Text style={styles.title}>Gas</Text>
                <View style={{alignItems: 'flex-end'}}>
                    
                    <View style={{flexDirection: "row"}}>
                <Text> $ </Text>
                <Switch 

                onTintColor={salmon}
                tintColor={salmon}

                onValueChange={
                    function(value){
                     self.setState({sortGasByPrice: !value,
                        loading: true
                     });
                    
                     
                     console.log(self.state.sortGasByPrice)
                     if (value){
                        //TODO: calculate distance on the fly if necessary
                        self.props.options.sort((a,b)=>{return (a.distance > b.distance)?1: ((b.distance > a.distance)?-1:0);});

                     }
                     else{
                        
                        self.props.options.sort((a,b)=>{return (a.price > b.price)?1: ((b.price > a.price)?-1:0);});
                     }

                     self.props.updateGasFunc(self.props.options);
                     //updates the gasfoodsubswiper
                     self.setState({
                        hasNewOptions:true,
                     });

                     setTimeout(function(){
                        self.setState({
                            loading:false
                        })
                     },100);

                    } 
                 }

                value={!this.state.sortGasByPrice} />
                <Text> Dist.</Text>
            </View>
                </View>
                <GasFoodSwiperContainer
                    {...this.props}
                    hasNewOptions={this.state.hasNewOptions}
                    hasSetOptions={this._hasSetOptions}
                    latitude={this.props.currentPosition.latitude}
                    loading={this.state.loading}
                    longitude={this.props.currentPosition.longitude}
                    onSwipe={this.props.onSwipe}
                    optionLatitude={this.props.optionLatitude}
                    optionLongitude={this.props.optionLongitude}
                    options={this.props.options.slice(0,this.state.MAX_NUMBER_GAS_STATIONS_IN_PRICE_MODE)}
                />
            </View>
        );
    },
});

var styles = StyleSheet.create({
    title: {
        color: '#404040',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 7,
        textAlign: 'center',
    },
});

module.exports = GasSwiperContainer;
