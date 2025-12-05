// src/components/GoogleMap/GoogleMap.jsx
import { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import './GoogleMap.css';

const libraries = ['places'];

const MapComponent = ({ projects, selectedProjectId, onMarkerClick }) => {
    const [map, setMap] = useState(null);
    const [geocodedProjects, setGeocodedProjects] = useState([]);
    const [isGeocoding, setIsGeocoding] = useState(true);
    const markersRef = useRef([]);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    // Geocode all project addresses
    useEffect(() => {
        if (!isLoaded || !projects || projects.length === 0) {
            console.log('🗺️ Map not ready or no projects:', { isLoaded, projectsCount: projects?.length });
            return;
        }

        console.log('🗺️ Starting geocoding for projects:', projects);

        const geocodeProjects = async () => {
            setIsGeocoding(true);
            const geocoder = new window.google.maps.Geocoder();
            const geocodedData = [];

            for (const project of projects) {
                const location = project.translations?.en?.location ||
                    project.translations?.ar?.location ||
                    project.translations?.he?.location ||
                    project.location;

                console.log(`🗺️ Project ${project.id} location:`, location);

                if (!location) {
                    console.warn(`❌ Project ${project.id} has no location`);
                    continue;
                }

                try {
                    const result = await new Promise((resolve, reject) => {
                        geocoder.geocode({ address: location }, (results, status) => {
                            if (status === 'OK' && results[0]) {
                                resolve(results[0]);
                            } else {
                                reject(new Error(`Geocoding failed: ${status}`));
                            }
                        });
                    });

                    geocodedData.push({
                        ...project,
                        lat: result.geometry.location.lat(),
                        lng: result.geometry.location.lng(),
                    });
                } catch (error) {
                    console.warn(`Failed to geocode project ${project.id}:`, error.message);
                }
            }

            console.log('✅ Geocoding complete. Results:', geocodedData);
            setGeocodedProjects(geocodedData);
            setIsGeocoding(false);
        };

        geocodeProjects();
    }, [isLoaded, projects]);

    // Create native Google Maps markers
    useEffect(() => {
        if (!map || geocodedProjects.length === 0) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Create new markers
        geocodedProjects.forEach((project) => {
            const isSelected = project.id === selectedProjectId;

            const marker = new window.google.maps.Marker({
                position: { lat: project.lat, lng: project.lng },
                map: map,
                icon: isSelected
                    ? 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                    : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                animation: isSelected ? window.google.maps.Animation.BOUNCE : null,
                zIndex: isSelected ? 1000 : 100,
            });

            marker.addListener('click', () => {
                console.log('🖱️ Marker clicked:', project.id);
                onMarkerClick(project);
            });

            markersRef.current.push(marker);
        });

        // LOGIC CHANGE: Center on selected project OR Fit all bounds
        const selectedProjectData = geocodedProjects.find(p => p.id === selectedProjectId);

        if (selectedProjectData) {
            // Case 1: A project is selected -> Center but keep wide view
            map.panTo({ lat: selectedProjectData.lat, lng: selectedProjectData.lng });
            map.setZoom(13); // Changed from 16 to 13 (shows context/surroundings)
        } else {
            // Case 2: No selection -> Show all markers
            const bounds = new window.google.maps.LatLngBounds();
            if (geocodedProjects.length > 0) {
                geocodedProjects.forEach((project) => {
                    bounds.extend({ lat: project.lat, lng: project.lng });
                });
                map.fitBounds(bounds);

                // Prevent zooming in too close if there's only 1 project in total
                const listener = window.google.maps.event.addListenerOnce(map, "idle", () => {
                    if (map.getZoom() > 15) map.setZoom(15);
                });
            }
        }

    }, [map, geocodedProjects, selectedProjectId, onMarkerClick]);

    const onLoad = useCallback((map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        // Clean up markers
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        setMap(null);
    }, []);

    if (loadError) {
        return (
            <div className="map-error">
                <p>Error loading map. Please check your API key.</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="map-loading">
                <div className="spinner"></div>
                <p>Loading map...</p>
            </div>
        );
    }

    if (isGeocoding) {
        return (
            <div className="map-loading">
                <div className="spinner"></div>
                <p>Locating properties...</p>
            </div>
        );
    }

    if (geocodedProjects.length === 0) {
        return (
            <div className="map-error">
                <p>No properties to display on map</p>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerClassName="google-map-container"
            center={{ lat: 32.7033, lng: 35.2936 }}
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
                gestureHandling: 'greedy',
            }}
        >
            {/* Markers are created via native API in useEffect above */}
        </GoogleMap>
    );
};

export default MapComponent;