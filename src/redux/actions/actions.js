import * as actionTypes from './types';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

export const checkUser = (navigation) => async (dispatch) => {
  let UserdataAsync = await AsyncStorage.getItem('userdata');
  let userdata = JSON.parse(UserdataAsync);
  if (userdata) {
    dispatch({
      type: actionTypes.SET_USER_DATA,
      payload: userdata,
    });
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Todos'}],
      }),
    );
  } else {
    dispatch({type: actionTypes.START_LOADING});
    let data = {
      name: 'Usero',
      todos: [],
    };
    AsyncStorage.setItem('userdata', JSON.stringify(data)).then(() => {
      dispatch({
        type: actionTypes.SET_USER_DATA,
        payload: data,
      });

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Todos'}],
        }),
      );
    });

    dispatch({type: actionTypes.STOP_LOADING});
  }
};

export const addTodo = (navigation, userdata) => async (dispatch) => {
  dispatch({type: actionTypes.START_LOADING});

  AsyncStorage.setItem('userdata', JSON.stringify(userdata)).then(() => {
    dispatch({
      type: actionTypes.SET_USER_DATA,
      payload: userdata,
    });
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Todos'}],
      }),
    );
  });
  dispatch({type: actionTypes.STOP_LOADING});
};

export const updateTodo = (userdata, swipeRef) => async (dispatch) => {
  AsyncStorage.setItem('userdata', JSON.stringify(userdata)).then(() => {
    dispatch({
      type: actionTypes.SET_USER_DATA,
      payload: userdata,
    });
    if (swipeRef !== undefined) swipeRef.close();
  });
};
