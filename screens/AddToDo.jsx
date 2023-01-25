import React, { useState } from "react";
import {
	View,
	TouchableOpacity,
	StyleSheet,
	Text,
	TextInput,
	Switch,
	Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { addTodoReducer } from "../redux/toDosSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Appearance } from "react-native";
const colorScheme = Appearance.getColorScheme();

const AddToDo = () => {
	const dispatch = useDispatch();
	const navigation = useNavigation();

	const listTodos = useSelector((state) => state.todos.todos);

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState("low");
	const [date, setDate] = useState(new Date());
	const [mode, setMode] = useState("date");
	const [show, setShow] = useState(false);
	const [withAlert, setWithAlert] = useState(false);
	const [isEnabled, setIsEnabled] = useState(false);

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate;
		setShow(false);
		setDate(currentDate);
	};

	const showMode = (currentMode) => {
		if (Platform.OS === "android") {
			setShow(true);
		}
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showMode("date");
	};

	const showTimepicker = () => {
		showMode("time");
	};

	const handlerPriority = (value) => {
		setPriority(value);
	};

	const addTodo = async () => {
		const newTodo = {
			id: uuid.v4(),
			title: name,
			priority: priority,
			description: description,
			date: date.toISOString(),
			isCompleted: false,
		};

		console.log(typeof(newTodo.date));
		console.log(newTodo.date);
		// try {
		// 	await AsyncStorage.setItem(
		// 		"@Todos",
		// 		JSON.stringify([...listTodos, newTodo])
		// 	);
		// 	dispatch(addTodoReducer(newTodo));
		// 	withAlert ? await scheduleTodoNotification(newTodo) : null;
		// 	navigation.goBack();
		// } catch (error) {
		// 	console.log(error);
		// }
	};

	const scheduleTodoNotification = async (todo) => {
		const trigger = new Date(todo.hour);
		try {
			await Notifications.scheduleNotificationAsync({
				content: {
					title: `It's time!`,
					body: todo.text,
				},
				trigger,
			});
		} catch (error) {
			alert(
				"The notification falied to schedule, make sure the hour is valid"
			);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Add Todo</Text>
			<View style={styles.inputContainer}>
				<Text style={styles.inputTitle}>Name</Text>
				<TextInput
					style={styles.textInput}
					placeholder="Task title"
					placeholderTextColor={colorScheme === "light" ? null : "grey"}
					onChangeText={(text) => {
						setName(text);
					}}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputTitle}>Description</Text>
				<TextInput
					multiline={true}
					numberOfLines={5}
					style={styles.inputDescrip}
					placeholder="task description..."
					placeholderTextColor={colorScheme === "light" ? null : "grey"}
					onChangeText={(text) => {
						setDescription(text);
					}}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputTitle}>Hour</Text>
				<Text style={styles.time}>
					{date.toLocaleTimeString().slice(0, -3)}
				</Text>
				{show && (
					<DateTimePicker
						value={date}
						mode={mode}
						is24Hour={true}
						onChange={onChange}
					/>
				)}

				<TouchableOpacity
					onPress={showTimepicker}
					style={styles.prioritybutton}
				>
					<Text style={styles.priorityText}>SELECT HOUR</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputTitle}>Date</Text>
				<Text style={styles.time}>{date.toDateString()}</Text>

				<TouchableOpacity
					onPress={showDatepicker}
					style={styles.prioritybutton}
				>
					<Text style={styles.priorityText}>SELECT DATE</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.inputContainer}>
				<Text style={styles.inputTitle}>Priority</Text>
				<View
					style={{
						flexDirection: "row",
					}}
				>
					<TouchableOpacity
						onPress={() => handlerPriority("low")}
						style={
							priority === "low"
								? [
										styles.prioritybutton,
										{
											backgroundColor: "#00a400",
											borderColor: "black",
											borderWidth: 2,
										},
								  ]
								: styles.prioritybutton
						}
					>
						<Text
							style={
								priority === "low"
									? [(styles.priorityText, { color: "black" })]
									: [(styles.priorityText, { color: "#00a400" })]
							}
						>
							LOW
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => handlerPriority("regular")}
						style={
							priority === "regular"
								? [
										styles.prioritybutton,
										{
											backgroundColor: "#e7e700",
											borderColor: "black",
											borderWidth: 2,
										},
								  ]
								: styles.prioritybutton
						}
					>
						<Text
							style={
								priority === "regular"
									? [(styles.priorityText, { color: "black" })]
									: [(styles.priorityText, { color: "#e7e700" })]
							}
						>
							REGULAR
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => handlerPriority("high")}
						style={
							priority === "high"
								? [
										styles.prioritybutton,
										{
											backgroundColor: "#9d0000",
											borderColor: "black",
											borderWidth: 2,
										},
								  ]
								: styles.prioritybutton
						}
					>
						<Text
							style={
								priority === "high"
									? [(styles.priorityText, { color: "black" })]
									: [(styles.priorityText, { color: "#9d0000" })]
							}
						>
							HIGH
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.inputContainer}>
				<View>
					<Text style={styles.inputTitle}>Alert</Text>
					<Text style={styles.descrip}>
						You will receive an alert at the time you set for this reminder
					</Text>
				</View>
				<Switch
					value={withAlert}
					onValueChange={(value) => {
						setWithAlert(value);
					}}
					trackColor={{ false: "#767577", true: "#3ccc15" }}
					thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
				/>
			</View>
			<View style={styles.btons}>
				<TouchableOpacity
					onPress={() => navigation.navigate("Home")}
					style={styles.button}
				>
					<Text style={[styles.done, { color: "red" }]}>Cancel</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={addTodo} style={styles.button}>
					<Text style={styles.done}>Done</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingVertical: "10%",
		backgroundColor: colorScheme === "light" ? "#fff" : "black",
	},
	title: {
		fontSize: 34,
		fontWeight: "bold",
		marginBottom: 35,
		marginTop: 10,
		color: colorScheme === "light" ? "black" : "#F7F8FA",
	},
	inputTitle: {
		fontSize: 20,
		fontWeight: "600",
		lineHeight: 24,
		color: colorScheme === "light" ? "black" : "#fff",
	},
	textInput: {
		borderBottomColor: colorScheme === "light" ? "#00000030" : "#fff",
		borderBottomWidth: 1,
		width: "65%",
		color: colorScheme === "light" ? null : "#fff",
	},
	inputDescrip: {
		borderBottomColor: colorScheme === "light" ? "#00000030" : "#fff",
		borderBottomWidth: 1,
		width: "65%",
		color: colorScheme === "light" ? null : "#fff",
	},
	inputContainer: {
		justifyContent: "space-between",
		flexDirection: "row",
		paddingBottom: 20,
		paddingTop: 10,
		alignItems: "center",
	},
	time: {
		fontSize: 15,
		fontWeight: "600",
		lineHeight: 24,
		color: colorScheme === "light" ? "black" : "#fff",
	},
	button: {
		marginTop: 30,
		marginBottom: 15,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colorScheme === "light" ? "black" : "#fff",
		height: 46,
		borderRadius: 11,
		width: "40%",
	},
	btons: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	done: {
		color: colorScheme === "light" ? "#fff" : "black",
		fontWeight: "bold",
		fontSize: 20,
	},
	descrip: {
		color: colorScheme === "light" ? "#00000060" : "#fff",
		fontSize: 12,
		maxWidth: "85%",
	},
	priorityText: {
		color: colorScheme === "light" ? "#fff" : "#000",
		fontWeight: "bold",
		fontSize: 14,
	},
	prioritybutton: {
		alignItems: "center",
		justifyContent: "center",
		height: 40,
		margin: 10,
		borderRadius: 2,
		padding: 6,
		backgroundColor: colorScheme === "light" ? "black" : "#fff",
	},
});

export default AddToDo;
