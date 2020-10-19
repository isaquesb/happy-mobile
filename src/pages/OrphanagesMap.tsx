import React, { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';

import mapMarker from '../images/map-marker.png';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';
import Happy from '../@types/happy';

export default function OrphanagesMap() {
    const navigation = useNavigation();
    const [orphanages, setOrphanages] = useState<Happy.Orphanage[]>([]);
    useFocusEffect(() => {
        api.get('orphanages').then(response => {
            setOrphanages(response.data);
        });
    });
    function toCreate() {
        navigation.navigate('SelectMapPosition');
    }
    function toDetails(id: number) {
        navigation.navigate('OrphanageDetails', { id: id });
    }
    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: -23.5330351,
                    longitude: -46.794087,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008,
                }}
            >
                {orphanages.map(row => {
                    return (
                        <Marker
                            key={row.id}
                            icon={mapMarker}
                            calloutAnchor={{
                                x: 2.5,
                                y: 0.8
                            }}
                            coordinate={{
                                latitude: row.latitude,
                                longitude: row.longitude,
                            }}
                        >
                            <Callout tooltip onPress={() => toDetails(row.id)}>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutText}>{row.name}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    );
                })}
            </MapView>
            <View style={styles.footer}>
                <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>
                <RectButton style={styles.createButton} onPress={() => toCreate()}>
                    <Feather name="plus" size={20} color="#FFF" />
                </RectButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 32,

        backgroundColor: '#FFF',
        borderRadius: 20,
        height: 56,
        paddingLeft: 24,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        elevation: 3,
    },
    footerText: {
        color: '#8fa7b3',
        fontFamily: 'Nunito_700Bold'
    },
    createButton: {
        width: 56,
        height: 56,
        backgroundColor: '#15c3d6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    calloutContainer: {
        width: 168,
        height: 46,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 16,
        justifyContent: 'center',
    },
    calloutText: {
        color: '#8889a5',
        fontSize: 14,
        fontFamily: 'Nunito_700Bold'
    }
});
