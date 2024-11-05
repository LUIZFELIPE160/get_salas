import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const EditReservationScreen = ({ route, navigation }) => {
  const { reservation, index } = route.params;
  const [professorName, setProfessorName] = useState(reservation.professorName);
  const [date, setDate] = useState(reservation.date);
  const [time, setTime] = useState(reservation.time);
  const [studentCount, setStudentCount] = useState(reservation.studentCount.toString());
  const [duration, setDuration] = useState(reservation.duration.toString());
  const [roomNumber, setRoomNumber] = useState(reservation.roomNumber.toString());

  useEffect(() => {
    navigation.setOptions({ title: 'Editar Reserva' });
  }, [navigation]);

  const handleUpdate = async () => {
    if (!professorName || !date || !studentCount || !duration) {
      Alert.alert('Por favor, preencha todos os campos!');
      return;
    }

    const updatedReservation = {
      professorName,
      date,
      time,
      studentCount: parseInt(studentCount, 10),
      duration: parseInt(duration, 10),
      roomNumber: parseInt(roomNumber, 10),
    };

    try {
      const existingReservations = JSON.parse(await AsyncStorage.getItem('reservations')) || [];
      existingReservations[index] = updatedReservation; // Atualiza a reserva no índice específico
      await AsyncStorage.setItem('reservations', JSON.stringify(existingReservations));
      Alert.alert('Reserva atualizada com sucesso!');
      navigation.navigate('Reservations'); // Navega de volta para a tela de reservas
    } catch (error) {
      Alert.alert('Erro ao atualizar a reserva!', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Reservante:</Text>
        <TextInput
          style={styles.input}
          value={professorName}
          onChangeText={setProfessorName}
        />

        <Text style={styles.label}>Data:</Text>
        <TextInput
          style={styles.input}
          value={date}
          keyboardType="numeric"
          onChangeText={setDate}
        />

        <Text style={styles.label}>Horas:</Text>
        <TextInput
          style={styles.input}
          value={time}
          keyboardType="numeric"
          onChangeText={setTime}
        />

        <Text style={styles.label}>Participantes:</Text>
        <TextInput
          style={styles.input}
          value={studentCount}
          keyboardType="numeric"
          onChangeText={setStudentCount}
        />

        <Text style={styles.label}>Tempo de Uso (min):</Text>
        <TextInput
          style={styles.input}
          value={duration}
          keyboardType="numeric"
          onChangeText={setDuration}
        />

        <Text style={styles.label}>Sala:</Text>
        <Picker
          selectedValue={roomNumber}
          style={styles.picker}
          onValueChange={(itemValue) => setRoomNumber(itemValue)}
        >
          {[...Array(9)].map((_, index) => {
            const roomNum = 101 + index;
            return <Picker.Item key={roomNum} label={`Sala ${roomNum}`} value={roomNum.toString()} />;
          })}
        </Picker>

        <Button
          style={styles.addbtn}
          title="Atualizar Reserva"
          onPress={handleUpdate}
          color="#841584"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  addbtn: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default EditReservationScreen;