'use strict';

var Icon = require('react-native-vector-icons/FontAwesome');
var React = require('react-native');

var {
    PropTypes,
    StyleSheet,
    TextInput,
    View,
} = React;

var SurveySearchBar = React.createClass({
    propTypes: {
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        setOptions: PropTypes.func.isRequired,
    },

    componentDidMount: function() {
        //this.refs.searchBar.focus();
    },

    getInitialState: function() {
        return {
            isSearchBehind: false,
            isSearching: false,
            locationText: '',
            searchText: '',
        };
    },

    render: function() {
        return (
            <View style={styles.container}>
                <View
                    style={[styles.textInputContainer, styles.searchContainer]}>
                    <Icon
                        style={styles.searchIcon}
                        name="search"
                        size={15}
                        color={'#B3B3B3'}
                    />
                    <TextInput
                        clearButtonMode={'always'}
                        onChangeText={this._onSearchTextChange}
                        placeholder='Search Restaurants Near'
                        ref="searchBar"
                        selectionColor={'#6BCDFD'}
                        style={styles.textInput}
                        value={this.state.searchText}
                    />
                </View>
                <View
                    style={[styles.textInputContainer, styles.locationContainer]}>
                    <TextInput
                        clearButtonMode={'always'}
                        onChangeText={this._onLocationTextChange}
                        placeholder='Current Location'
                        selectionColor={'#6BCDFD'}
                        style={styles.textInput}
                        value={this.state.locationText}
                    />
                </View>
            </View>
        );
    },

    _onLocationTextChange: function(text) {
        // order matters
        // otherwise can search old location text after it has been cleared
        this.setState({locationText: text});
        this._search(this.state.searchText);
    },

    _onSearchTextChange: function(text) {
        this._search(text);
        this.setState({searchText: text});
    },

    _search: function(text) {
        // reset options and avoid API call that will fail
        if (!text.length) {
            this.props.setOptions('{}', false);
            return;
        }

        // don't allow searching while still waiting results
        // avoids textInput from getting ahead of js _search
        // otherwise event stack would be way off from user perspective
        // due to time for API call, which is seen when typing quickly
        if (this.state.isSearching) {
            this.setState({isSearchBehind: true});
            console.log('search behind')
            return;
        }

        // TODO (urlauba): change url
        this.setState({isSearching: true});
        fetch('http://73.161.192.135:3000/api/search/'
            + this.props.latitude + '/' + this.props.longitude + '/'
            + text + '/' + this.state.locationText)
            .then((response) => response.text())
            .then((responseText) => {
                this.setState({isSearching: false});

                this.props.setOptions(responseText, true);

                // needed if user stops typing while API results are still
                // being retrieved, so last text typed agrees with results
                if (this.state.isSearchBehind) {
                    this.setState({isSearchBehind: false});
                    this._search(this.state.searchText);
                }
            })
            .catch((error) => {
                // TODO (urlauba): handle error state
                console.log(error)
            })
    },
});

var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#CCCCCC',
        borderColor: '#6BCDFD',
        borderTopWidth: 2,
        flexDirection: 'row',
        height: 40,
    },
    searchContainer: {
        flex: 0.6,
    },
    searchIcon: {
        marginLeft: 6,
    },
    locationContainer: {
        flex: 0.4,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        height: 28,
        marginLeft: 4,
    },
    textInputContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        flexDirection: 'row',
        marginLeft: 8,
        marginRight: 8,
    },
});

module.exports = SurveySearchBar;
