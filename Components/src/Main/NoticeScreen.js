import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, AsyncStorage, Platform } from "react-native";
import { Icon, Container, Content, Header, Left, Right, Body } from "native-base";

import PostCardScreen from "./PostCardScreen";

import { ip, port } from "../../../Secret"

export default class NoticeScreen extends Component {
    _navigate1() {
        this.props.navigation.navigate("WriteScreen", { addData: this.addData, type: "Notice" });
    }

    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => <Icon name="ios-paper" style={{ color: tintColor }} />
    };

    state = {
        post: [],
        isLoaded: false,
        user: {}
    };

    constructor(props) {
        super(props);
        this.addData = this.addData.bind(this);
        this.removeData = this.removeData.bind(this);
        this.editData = this.editData.bind(this);
        this.loadDataFromDB = this.loadDataFromDB.bind(this);
    }

    async loadDataFromDB() {
        this.setState({
            isLoaded: false
        });

        await fetch(`http://${ip}:${port}/api/posts/type/Notice`)
            .then(res => res.json())
            .then(resJson => {
                console.log(resJson);
                if (resJson !== null) {
                    this.setState({
                        post: resJson
                    });
                }
            });

        AsyncStorage.getItem("userData").then(data => {
            const user = JSON.parse(data || "[]");
            this.setState({ user });
        });

        this.setState({
            isLoaded: true
        });
    }

    componentDidMount() {
        this.loadDataFromDB();
    }

    // [Add a Data]
    addData(data) {
        if (data.title && data.author && data.post) {
            fetch(`http://${ip}:${port}/api/posts`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: data.title,
                    author: data.author,
                    post: data.post,
                    published_date: Date.now()
                })
            }).then(() => {
                this.loadDataFromDB();
            });
        }
    }

    // [Remove a Data]
    removeData(id) {
        fetch(`http://${ip}:${port}/api/posts/${id}`, {
            method: "DELETE"
        });

        this.loadDataFromDB();
    }

    // [Update a Data]
    editData(data) {
        fetch(`http://${ip}:${port}/api/posts/${data._id}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: data.title,
                author: data.author,
                post: data.post,
                published_date: data.published_date
            })
        }).then(() => this.loadDataFromDB());
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header>
                    <Left>
                        <TouchableOpacity onPress={this._navigate1.bind(this)}>
                            <Icon name="ios-add" style={{ paddingLeft: 10 }} />
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <Text>공지게시판</Text>
                    </Body>
                    <Right>
                        <Icon name="ios-search" style={{ paddingRight: 10 }} />
                    </Right>
                </Header>
                <Content>
                    <PostCardScreen
                        post={this.state.post}
                        navigation={this.props.navigation}
                        removeData={this.removeData}
                        editData={this.editData}
                        user={this.state.user}
                    />
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === `ios` ? 0 : Expo.Constants.statusBarHeight
    },
    Header: {
        backgroundColor: "#3ED0C8"
    }
});
