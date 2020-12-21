import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import colors from '../constants/colors';
import fontSizes from '../constants/fontSizes';
import globalStyling from '../constants/globalStyling';
import {bindActionCreators} from 'redux';
import * as reduxActions from '../redux/actions/actions';
import {connect} from 'react-redux';
import selectedColors from '../constants/selectedColors';
import moment from 'moment';
import {Swipeable, TextInput} from 'react-native-gesture-handler';
import InternAdCard from '../components/InternAdCard';

const Todos = ({navigation, reduxState, reduxActions}) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      global.showBottomTab(true).then(() => {
        global.setFocused('todos');
      });
    });
    return unsubscribe;
  }, []);

  const dateToFromNowDaily = (myDate) => {
    // get from-now for this date
    var fromNow = moment(myDate).fromNow();

    // ensure the date is displayed with today and yesterday
    return moment(myDate).calendar(null, {
      // when the date is closer, specify custom values
      lastWeek: '[Last] dddd',
      lastDay: '[Yesterday]',
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      // when the date is further away, use from-now functionality
      sameElse: function () {
        return '[' + fromNow + ']';
      },
    });
  };

  let swipeableRef = useRef(null);
  const renderItem = ({item, index, separators}) => (
    <Swipeable
      ref={(swipe) => {
        swipeableRef = swipe;
      }}
      renderLeftActions={() => (
        <TouchableOpacity
          style={styles.renderSwipeView}
          onPress={() => {
            let userdata = JSON.parse(JSON.stringify(reduxState.userdata));
            userdata.todos.splice(index, 1);
            reduxActions.updateTodo(userdata);
          }}>
          <Text style={{color: colors.redErrorColor}}>Tap To Delete</Text>
        </TouchableOpacity>
      )}
      renderRightActions={() => (
        <View style={styles.renderSwipeView}>
          <Text style={{color: colors.themeColor}}>Completed</Text>
        </View>
      )}
      onSwipeableRightOpen={() => {
        let userdata = JSON.parse(JSON.stringify(reduxState.userdata));
        userdata.todos[index].completed = true;
        reduxActions.updateTodo(userdata, swipeableRef);
      }}>
      <View style={styles.containerView}>
        <View
          style={[
            styles.colorView,
            {backgroundColor: selectedColors[item.colorSelected]},
          ]}
        />
        <View>
          <Text
            style={[
              styles.work,
              {
                textDecorationLine: item.completed ? 'line-through' : null,
                color: item.completed
                  ? colors.greyTextColor
                  : colors.blackColor,
              },
            ]}>
            {item.work}
          </Text>
          <Text
            style={[
              styles.date,
              {
                color: item.completed
                  ? colors.greyTextColor
                  : colors.blackColor,
              },
            ]}>
            Due {dateToFromNowDaily(item.dueDate)} at{' '}
            {moment(item.dueDate).format('hh:mm A')}
          </Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Jama ToDo</Text>
      <Text
        style={{
          marginLeft: 20,
          marginTop: 16,
          color: '#8c91a8',
          fontWeight: '700',
        }}>
        Now keep record of all trading todos
      </Text>
      <View style={styles.adpostContainer}>
        <InternAdCard />
      </View>
      <Text
        style={{
          marginLeft: 20,
          marginTop: 16,
          color: '#8c91a8',
          fontWeight: '700',
        }}>
        Your Tasks
      </Text>
      <ScrollView style={styles.internContainer}>
        <FlatList
          style={globalStyling.flatlist}
          ListEmptyComponent={
            <Text style={styles.noTodos}>No Task to show</Text>
          }
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          data={reduxState.userdata.todos}
          removeClippedSubviews={true}
          keyExtractor={(item, i) => i.toString()}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  adpost: {
    height: 200,
    width: '100%',
  },
  adpostContainer: {
    padding: 20,
  },
  container: {
    backgroundColor: '#f2f3f7',
  },
  formField: {
    flex: 1,
    borderWidth: null,
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: 'white',
    fontSize: 18,
    height: 50,
    backgroundColor: 'white',
    marginBottom: 6,
  },
  heading: {
    fontSize: 40,
    marginLeft: 20,
    color: '#8c91a8',
    fontWeight: '800',
  },
  internContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  searchConatiner: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 16,
  },
  noTodos: {color: colors.redErrorColor, textAlign: 'center'},
  renderSwipeView: {justifyContent: 'center', marginHorizontal: 10},
  containerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  colorView: {
    height: 20,
    width: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  work: {
    fontWeight: 'bold',
    fontSize: fontSizes.large,
  },
  date: {fontSize: fontSizes.normal},
});

const mapStateToProps = (state) => ({
  reduxState: state.reducers,
});

const mapDispatchToProps = (dispatch) => ({
  reduxActions: bindActionCreators(reduxActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
