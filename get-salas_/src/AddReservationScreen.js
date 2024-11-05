import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const AddReservScreen = ({ navigation }) => {
  const [professorName, setProfessorName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [studentCount, setStudentCount] = useState('');
  const [duration, setDuration] = useState('');
  const [roomNumber, setRoomNumber] = useState('105');

  useEffect(() => {
    navigation.setOptions({ title: 'Reservar' });
  }, [navigation]);

  // Função para formatar a data e adicionar automaticamente as barras "/"
  const handleDateInput = (text) => {
    let cleaned = text.replace(/[^0-9]/g, ''); // Remove qualquer caractere que não seja número

    if (cleaned.length >= 2) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 5) {
      cleaned = cleaned.slice(0, 5) + '/' + cleaned.slice(5, 9);
    }

    setDate(cleaned);
  };

  const handleTimeInput = (text) => {
    let cleaned = text.replace(/[^0-9]/, ''); // Remove qualquer caractere que não seja número

    if (cleaned.length >= 2) {
      cleaned = cleaned.slice(0, 2) + ':' + cleaned.slice(2);
    }
    if (cleaned.length > 5) {
      cleaned = cleaned.slice(0, 5); // Limita a string a 'hh:mm'
    }

    setTime(cleaned);
};


  const handleAddReservation = async () => {
    if (!professorName || !date || !studentCount || !duration) {
      Alert.alert('Por favor, preencha todos os campos!');
      return;
    }

    const newReservation = {
      professorName,
      date,
      time,
      studentCount: parseInt(studentCount, 10),
      duration: parseInt(duration, 10),
      roomNumber: parseInt(roomNumber, 10),
    };

    try {
      const existingReservations = JSON.parse(await AsyncStorage.getItem('reservations')) || [];

      // Verificar se já existe uma reserva para o mesmo dia e sala
      const seConflito = existingReservations.some(
        (reservation) =>
          reservation.date === newReservation.date && 
          reservation.roomNumber === newReservation.roomNumber &&
          reservation.time === newReservation.time
      );

      if (seConflito) {
        Alert.alert('Já existe uma reserva para essa sala no mesmo dia!');
        return;
      }

      existingReservations.push(newReservation);
      await AsyncStorage.setItem('reservations', JSON.stringify(existingReservations));
      Alert.alert('Reserva adicionada com sucesso!');
      navigation.navigate('Reservations');
    } catch (error) {
      Alert.alert('Erro ao adicionar a reserva!', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Reservante:</Text>
      <TextInput
        style={styles.input}
        value={professorName}
        onChangeText={setProfessorName}
        placeholder="Digite o nome do reservante"
        placeholderTextColor="#b0b0b0"
      />

      <Text style={styles.label}>Data:</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={handleDateInput} // Usando a função para formatar a data
        keyboardType="numeric"
        placeholder="DD/MM/AAAA"
        placeholderTextColor="#b0b0b0"
      />

      <Text style={styles.label}>Horas:</Text>
      <TextInput
        style={styles.input}
        value={time}
        onChangeText={handleTimeInput} // Usando a função para formatar a data
        keyboardType="numeric"
        placeholder="HH:MM"
        placeholderTextColor="#b0b0b0"
      />

      <Text style={styles.label}>Participantes:</Text>
      <TextInput
        style={styles.input}
        value={studentCount}
        keyboardType="numeric"
        onChangeText={setStudentCount}
        placeholder="Digite a quantidade de participantes"
        placeholderTextColor="#b0b0b0"
      />



      <Text style={styles.label}>Tempo de Uso (min):</Text>
      <TextInput
        style={styles.input}
        value={duration}
        keyboardType="numeric"
        onChangeText={setDuration}
        placeholder="Duração em minutos"
        placeholderTextColor="#b0b0b0"
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

      <TouchableOpacity style={styles.button} onPress={handleAddReservation}>
        <Text style={styles.buttonText}>Adicionar Reserva</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
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
  button: {
    backgroundColor: '#841584',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddReservScreen;
