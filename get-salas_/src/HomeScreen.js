import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('../imgFundo.jpg')} // Adiciona a imagem de fundo
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao Gerenciamento de Salas</Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Reservar Sala" 
            onPress={() => navigation.navigate('AddReservation')}
            color="#841584" // Cor do botão (opcional)
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Ver Reservas" 
            onPress={() => navigation.navigate('Reservations')}
            color="#841584" // Cor do botão (opcional)
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center', // ajusta a imagem no centro 
    resizeMode: 'cover', // Ajusta o tamanho da imagem de fundo
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40, // Move o conteúdo um pouco mais para cima
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 50, // adiciona espaçamento abaixo do título
    color: 'white', // cor do texto
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo transparente para o título
    padding: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    marginBottom: 25, // espaçamento entre os botões
    width: 250, // ajusta a largura do botão

  },
});

export default HomeScreen;
