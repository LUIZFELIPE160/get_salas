import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Reserv = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null); // Índice da reserva a ser excluída
  const [isModalVisible, setModalVisible] = useState(false); // Controle do modal de login
  const [username, setUsername] = useState(''); // Campo para o usuário
  const [password, setPassword] = useState(''); // Campo para a senha

  useEffect(() => {
    navigation.setOptions({ title: 'Minhas Reservas' });
  }, [navigation]);

  const loadReservations = async () => {
    const storedReservations = await AsyncStorage.getItem('reservations');
    if (storedReservations) {
      setReservations(JSON.parse(storedReservations));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadReservations();
    }, [])
  );

  const handleEdit = (index) => {
    navigation.navigate('EditReservation', { reservation: reservations[index], index });
  };

  const handleDelete = async () => {
    if (selectedIndex === null) return;

    try {
      const existingReservations = JSON.parse(await AsyncStorage.getItem('reservations')) || [];
      existingReservations.splice(selectedIndex, 1); // Remove a reserva
      await AsyncStorage.setItem('reservations', JSON.stringify(existingReservations));
      loadReservations(); // Recarrega as reservas após a exclusão
      Alert.alert('Reserva excluída com sucesso!');
      setSelectedIndex(null);
      setModalVisible(false); // Fecha o modal após a exclusão
    } catch (error) {
      Alert.alert('Erro ao excluir a reserva!', error.message);
    }
  };

  const requestLogin = (index) => {
    setSelectedIndex(index);
    setModalVisible(true); // Abre o modal de login
  };

  const confirmLogin = () => {
    if (username === 'admin' && password === '123456') {
      handleDelete(); // Exclui a reserva se o login for bem-sucedido
    } else {
      Alert.alert('Credenciais inválidas!');
    }
    setUsername(''); // Limpa o campo de usuário
    setPassword(''); // Limpa o campo de senha
    setModalVisible(false); // Fecha o modal após tentativa de login
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reservations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text style={styles.label}>Reservante: <Text style={styles.value}>{item.professorName}</Text></Text>
            <Text style={styles.label}>Data: <Text style={styles.value}>{item.date}</Text></Text>
            <Text style={styles.label}>Horas: <Text style={styles.value}>{item.time}</Text></Text>
            <Text style={styles.label}>Participantes: <Text style={styles.value}>{item.studentCount}</Text></Text>
            <Text style={styles.label}>Tempo de Uso: <Text style={styles.value}>{item.duration} min</Text></Text>
            <Text style={styles.label}>Sala: <Text style={styles.value}>{item.roomNumber}</Text></Text>
            <View style={styles.buttonContainer}>
              <Button title="Editar" onPress={() => handleEdit(index)} color="#1E90FF" />
              <Button title="Excluir" onPress={() => requestLogin(index)} color="#FF6347" />
            </View>
          </View>
        )}
      />
      <View style={styles.addButton}>
        <Button 
          title="Adicionar Reserva" 
          onPress={() => navigation.navigate('AddReservation')} 
          color="#841584" 
        />
      </View>

      {/* Modal para login */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Autenticação</Text>
            <TextInput
              style={styles.input}
              placeholder="Usuário"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#FF6347" />
              <Button title="OK" onPress={confirmLogin} color="#1E90FF" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontWeight: 'normal',
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  addButton: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 45,
    width: '100%',
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default Reserv;
