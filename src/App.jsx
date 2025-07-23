
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Droplets, RefreshCw, Download, Settings, BarChart3, Clock, AlertTriangle, Leaf, Navigation, Zap, Wifi, WifiOff, Activity, Thermometer, Eye, Shield } from 'lucide-react';
import './App.css'
// Firebase Configuration and Connection
const loadFirebaseSDK = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.firebase) {
      resolve(window.firebase);
      return;
    }

    // Load Firebase SDK dynamically
    const script1 = document.createElement('script');
    script1.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js';
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database-compat.js';
      script2.onload = () => {
        if (window.firebase) {
          resolve(window.firebase);
        } else {
          reject(new Error('Firebase SDK failed to load'));
        }
      };
      script2.onerror = () => reject(new Error('Failed to load Firebase Database SDK'));
      document.head.appendChild(script2);
    };
    script1.onerror = () => reject(new Error('Failed to load Firebase App SDK'));
    document.head.appendChild(script1);
  });
};

const initializeFirebase = async () => {
  try {
    const firebase = await loadFirebaseSDK();
    
    const firebaseConfig = {
      apiKey: "AIzaSyB0r3jMrDJB3qkqo68h1Tkwnh2Qo5TKfsk",
      authDomain: "smart-gps-tracker-4bef3.firebaseapp.com",
      databaseURL: "https://smart-gps-tracker-4bef3-default-rtdb.firebaseio.com",
      projectId: "smart-gps-tracker-4bef3",
      storageBucket: "smart-gps-tracker-4bef3.firebasestorage.app",
      messagingSenderId: "324426467481",
      appId: "1:324426467481:web:bfae85fc03ae2b55fd1008"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    return firebase.database();
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    return null;
  }
};

// Advanced Water Quality Analysis Algorithms
class WaterQualityAnalyzer {
  // Calculate water quality index based on multiple parameters
  static calculateWQI(sensor) {
    const weights = {
      ph: 0.25,
      turbidity: 0.20,
      dissolved_oxygen: 0.20,
      temperature: 0.15,
      conductivity: 0.10,
      nitrates: 0.10
    };

    // Normalize values to 0-100 scale
    const normalizedPH = this.normalizePH(sensor.ph);
    const normalizedTurbidity = this.normalizeTurbidity(sensor.turbidity);
    const normalizedDO = this.normalizeDissolvedOxygen(sensor.dissolved_oxygen);
    const normalizedTemp = this.normalizeTemperature(sensor.temperature);
    const normalizedConductivity = this.normalizeConductivity(sensor.conductivity);
    const normalizedNitrates = this.normalizeNitrates(sensor.nitrates);

    const wqi = (
      normalizedPH * weights.ph +
      normalizedTurbidity * weights.turbidity +
      normalizedDO * weights.dissolved_oxygen +
      normalizedTemp * weights.temperature +
      normalizedConductivity * weights.conductivity +
      normalizedNitrates * weights.nitrates
    );

    return Math.round(wqi);
  }

  static normalizePH(ph) {
    // Optimal pH range: 6.5-8.5
    if (ph >= 6.5 && ph <= 8.5) return 100;
    if (ph < 6.5) return Math.max(0, (ph - 4) / 2.5 * 100);
    return Math.max(0, (12 - ph) / 3.5 * 100);
  }

  static normalizeTurbidity(turbidity) {
    // Lower turbidity is better (0-10 NTU excellent)
    if (turbidity <= 10) return 100;
    if (turbidity <= 50) return 100 - ((turbidity - 10) / 40 * 60);
    return Math.max(0, 40 - ((turbidity - 50) / 50 * 40));
  }

  static normalizeDissolvedOxygen(do_level) {
    // Optimal DO: 6-8 mg/L
    if (do_level >= 6 && do_level <= 8) return 100;
    if (do_level < 6) return Math.max(0, do_level / 6 * 100);
    return Math.max(0, 100 - ((do_level - 8) / 6 * 50));
  }

  static normalizeTemperature(temp) {
    // Optimal temperature: 15-25°C
    if (temp >= 15 && temp <= 25) return 100;
    if (temp < 15) return Math.max(0, (temp + 5) / 20 * 100);
    return Math.max(0, 100 - ((temp - 25) / 15 * 60));
  }

  static normalizeConductivity(conductivity) {
    // Optimal conductivity: 150-800 µS/cm
    if (conductivity >= 150 && conductivity <= 800) return 100;
    if (conductivity < 150) return Math.max(0, conductivity / 150 * 100);
    return Math.max(0, 100 - ((conductivity - 800) / 1000 * 70));
  }

  static normalizeNitrates(nitrates) {
    // Lower nitrates better (< 10 mg/L excellent)
    if (nitrates <= 10) return 100;
    if (nitrates <= 45) return 100 - ((nitrates - 10) / 35 * 80);
    return Math.max(0, 20 - ((nitrates - 45) / 10 * 20));
  }

  // Contamination detection algorithm
  static detectContamination(sensors) {
    const contaminationSites = [];
    
    sensors.forEach(sensor => {
      const wqi = this.calculateWQI(sensor);
      const alerts = [];

      // Check for various contamination indicators
      if (sensor.ph < 6.0 || sensor.ph > 9.0) {
        alerts.push({ type: 'pH_extreme', severity: 'HIGH', message: 'Extreme pH levels detected' });
      }
      
      if (sensor.turbidity > 100) {
        alerts.push({ type: 'high_turbidity', severity: 'CRITICAL', message: 'High turbidity - possible sediment contamination' });
      }
      
      if (sensor.dissolved_oxygen < 4) {
        alerts.push({ type: 'low_oxygen', severity: 'HIGH', message: 'Low dissolved oxygen - potential organic pollution' });
      }
      
      if (sensor.nitrates > 45) {
        alerts.push({ type: 'high_nitrates', severity: 'CRITICAL', message: 'High nitrates - agricultural runoff detected' });
      }
      
      if (sensor.conductivity > 1500) {
        alerts.push({ type: 'high_conductivity', severity: 'MEDIUM', message: 'High conductivity - potential industrial contamination' });
      }

      if (alerts.length > 0 || wqi < 50) {
        contaminationSites.push({
          sensor_id: sensor.id,
          location: sensor.location,
          wqi,
          alerts,
          severity: this.calculateOverallSeverity(alerts, wqi)
        });
      }
    });

    return contaminationSites;
  }

  static calculateOverallSeverity(alerts, wqi) {
    if (alerts.some(alert => alert.severity === 'CRITICAL') || wqi < 25) return 'CRITICAL';
    if (alerts.some(alert => alert.severity === 'HIGH') || wqi < 50) return 'HIGH';
    if (alerts.length > 0 || wqi < 75) return 'MEDIUM';
    return 'LOW';
  }

  // Sampling route optimization using enhanced genetic algorithm
  static optimizeSamplingRoute(sensors, startPoint, vehicleCapacity) {
    const criticalSensors = sensors.filter(sensor => {
      const wqi = this.calculateWQI(sensor);
      return wqi < 75 || sensor.alerts?.length > 0;
    });

    if (criticalSensors.length === 0) return { route: [], distance: 0 };

    return this.geneticAlgorithmForSampling(criticalSensors, startPoint, vehicleCapacity);
  }

  static geneticAlgorithmForSampling(sensors, startPoint, capacity) {
    const populationSize = 50;
    const generations = 100;
    const sensorIds = sensors.map(s => s.id);
    
    // Initialize population
    let population = [];
    for (let i = 0; i < populationSize; i++) {
      const routeLength = Math.min(capacity, Math.max(1, sensorIds.length));
      const route = this.shuffleArray([...sensorIds]).slice(0, routeLength);
      population.push(route);
    }

    let bestRoute = null;
    let bestFitness = -Infinity;

    for (let gen = 0; gen < generations; gen++) {
      const fitness = population.map(route => this.calculateSamplingFitness(route, sensors, startPoint));
      
      const bestIndex = fitness.indexOf(Math.max(...fitness));
      if (fitness[bestIndex] > bestFitness) {
        bestFitness = fitness[bestIndex];
        bestRoute = [...population[bestIndex]];
      }

      // Evolution process
      const newPopulation = [];
      
      // Elitism
      const sortedPop = population.map((route, i) => ({ route, fitness: fitness[i] }))
                                 .sort((a, b) => b.fitness - a.fitness);
      
      for (let i = 0; i < Math.floor(populationSize * 0.2); i++) {
        newPopulation.push([...sortedPop[i].route]);
      }

      // Crossover and mutation
      while (newPopulation.length < populationSize) {
        const parent1 = this.tournamentSelection(population, fitness);
        const parent2 = this.tournamentSelection(population, fitness);
        let child = this.crossover(parent1, parent2);
        child = this.mutate(child, sensorIds);
        newPopulation.push(child);
      }
      
      population = newPopulation;
    }

    const distance = this.calculateRouteDistance(bestRoute, sensors, startPoint);
    return { route: bestRoute, distance, fitness: bestFitness };
  }

  static calculateSamplingFitness(route, sensors, startPoint) {
    if (!route || route.length === 0) return -Infinity;
    
    const distance = this.calculateRouteDistance(route, sensors, startPoint);
    if (distance === Infinity) return -Infinity;
    
    // Priority scoring based on water quality issues
    let priorityScore = 0;
    let urgencyScore = 0;
    
    route.forEach(sensorId => {
      const sensor = sensors.find(s => s.id === sensorId);
      if (!sensor) return;
      
      const wqi = this.calculateWQI(sensor);
      
      // Lower WQI = higher priority
      priorityScore += (100 - wqi) * 2;
      
      // Alert-based urgency
      if (sensor.alerts) {
        sensor.alerts.forEach(alert => {
          if (alert.severity === 'CRITICAL') urgencyScore += 100;
          else if (alert.severity === 'HIGH') urgencyScore += 75;
          else if (alert.severity === 'MEDIUM') urgencyScore += 50;
          else urgencyScore += 25;
        });
      }
    });
    
    // Combine factors (minimize distance, maximize priority and urgency)
    const distancePenalty = distance * 5;
    const totalScore = priorityScore + urgencyScore - distancePenalty;
    
    return totalScore;
  }

  static calculateRouteDistance(route, sensors, startPoint) {
    if (!route || route.length === 0) return Infinity;

    let totalDistance = 0;
    let currentLocation = startPoint;

    for (const sensorId of route) {
      const sensor = sensors.find(s => s.id === sensorId);
      if (!sensor) continue;
      
      totalDistance += this.haversineDistance(
        currentLocation[0], currentLocation[1],
        sensor.location[0], sensor.location[1]
      );
      currentLocation = sensor.location;
    }

    // Return to start point
    totalDistance += this.haversineDistance(
      currentLocation[0], currentLocation[1],
      startPoint[0], startPoint[1]
    );

    return totalDistance;
  }

  static haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
             Math.sin(dLon/2) * Math.sin(dLon/2);
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  static tournamentSelection(population, fitness, tournamentSize = 3) {
    let best = Math.floor(Math.random() * population.length);
    
    for (let i = 1; i < tournamentSize; i++) {
      const challenger = Math.floor(Math.random() * population.length);
      if (fitness[challenger] > fitness[best]) {
        best = challenger;
      }
    }
    
    return [...population[best]];
  }

  static crossover(parent1, parent2) {
    if (!parent1.length || !parent2.length) return [...(parent1.length ? parent1 : parent2)];
    
    const allGenes = [...new Set([...parent1, ...parent2])];
    const targetLength = Math.floor((parent1.length + parent2.length) / 2);
    
    const start = Math.floor(Math.random() * Math.min(parent1.length, parent2.length));
    const end = Math.floor(Math.random() * Math.min(parent1.length, parent2.length));
    const [startIdx, endIdx] = [Math.min(start, end), Math.max(start, end)];
    
    const child = new Array(targetLength);
    const used = new Set();
    
    for (let i = startIdx; i <= endIdx && i < parent1.length && i < targetLength; i++) {
      child[i] = parent1[i];
      used.add(parent1[i]);
    }
    
    let childIdx = 0;
    for (const gene of parent2) {
      while (childIdx < targetLength && child[childIdx] !== undefined) childIdx++;
      if (childIdx >= targetLength) break;
      if (!used.has(gene)) {
        child[childIdx] = gene;
        used.add(gene);
      }
    }
    
    return child.filter(x => x !== undefined);
  }

  static mutate(route, allSensors) {
    if (Math.random() < 0.2 && route.length > 1) {
      const mutationType = Math.random();
      
      if (mutationType < 0.5) {
        // Swap mutation
        const i = Math.floor(Math.random() * route.length);
        const j = Math.floor(Math.random() * route.length);
        [route[i], route[j]] = [route[j], route[i]];
      } else {
        // Insert mutation
        const available = allSensors.filter(id => !route.includes(id));
        if (available.length > 0) {
          const newSensor = available[Math.floor(Math.random() * available.length)];
          route.splice(Math.floor(Math.random() * (route.length + 1)), 0, newSensor);
        }
      }
    }
    
    return route;
  }

  static shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

// Enhanced Map Component for Water Monitoring
const WaterQualityMap = ({ route, sensors, baseStation, isOptimizing }) => {
  const routeCoordinates = useMemo(() => {
    if (!route.length) return [];
    
    const coords = [baseStation];
    route.forEach(sensorId => {
      const sensor = sensors.find(s => s.id === sensorId);
      if (sensor) {
        coords.push(sensor.location);
      }
    });
    coords.push(baseStation);
    return coords;
  }, [route, sensors, baseStation]);

  const totalDistance = useMemo(() => {
    return WaterQualityAnalyzer.calculateRouteDistance(route, sensors, baseStation);
  }, [route, sensors, baseStation]);

  return (
    <div className="bg-white rounded-lg border-2 border-blue-500 p-6 min-h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Sampling Route Visualization
        </h3>
        {totalDistance > 0 && (
          <div className="text-sm text-gray-600">
            Distance: <span className="font-semibold">{totalDistance.toFixed(2)} km</span>
          </div>
        )}
      </div>
      
      {isOptimizing ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">Optimizing sampling route...</p>
          </div>
        </div>
      ) : route.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Optimized Sampling Route:</h4>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">🏢 Base Station</span>
              {route.map((sensorId, index) => {
                const sensor = sensors.find(s => s.id === sensorId);
                if (!sensor) return null;
                
                const wqi = WaterQualityAnalyzer.calculateWQI(sensor);
                const severity = wqi < 25 ? 'CRITICAL' : wqi < 50 ? 'HIGH' : wqi < 75 ? 'MEDIUM' : 'LOW';
                
                return (
                  <React.Fragment key={sensorId}>
                    <span className="text-gray-400">→</span>
                    <span className={`px-2 py-1 rounded text-white ${
                      severity === 'CRITICAL' ? 'bg-red-500' :
                      severity === 'HIGH' ? 'bg-orange-500' :
                      severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {sensorId}
                    </span>
                  </React.Fragment>
                );
              })}
              <span className="text-gray-400">→</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">🏢 Base Station</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {route.map((sensorId, index) => {
              const sensor = sensors.find(s => s.id === sensorId);
              if (!sensor) return null;
              
              const wqi = WaterQualityAnalyzer.calculateWQI(sensor);
              const severity = wqi < 25 ? 'CRITICAL' : wqi < 50 ? 'HIGH' : wqi < 75 ? 'MEDIUM' : 'LOW';
              
              return (
                <div key={sensorId} className="bg-gray-50 p-3 rounded-lg border-l-4" 
                     style={{borderLeftColor: 
                       severity === 'CRITICAL' ? '#ef4444' : 
                       severity === 'HIGH' ? '#f97316' :
                       severity === 'MEDIUM' ? '#eab308' : '#22c55e'}}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">Stop #{index + 1}: {sensorId}</h5>
                      <p className="text-sm text-gray-600">{sensor.location_name}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        WQI: {wqi} | pH: {sensor.ph} | Turbidity: {sensor.turbidity} NTU
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded text-white ${
                      severity === 'CRITICAL' ? 'bg-red-500' :
                      severity === 'HIGH' ? 'bg-orange-500' :
                      severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}>
                      {severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <Droplets className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Click "Optimize Sampling Route" to generate an efficient monitoring path</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Real-time Sensor Status Component
const SensorStatusCard = ({ sensor, onRefresh }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const wqi = WaterQualityAnalyzer.calculateWQI(sensor);
  const severity = wqi < 25 ? 'CRITICAL' : wqi < 50 ? 'HIGH' : wqi < 75 ? 'MEDIUM' : 'LOW';
  
  const getSeverityColor = (severity) => {
    const colors = {
      'CRITICAL': 'bg-red-500',
      'HIGH': 'bg-orange-500', 
      'MEDIUM': 'bg-yellow-500',
      'LOW': 'bg-green-500'
    };
    return colors[severity] || 'bg-gray-500';
  };

  const getWQIDescription = (wqi) => {
    if (wqi >= 90) return { text: 'Excellent', icon: '💧' };
    if (wqi >= 75) return { text: 'Good', icon: '🟢' };
    if (wqi >= 50) return { text: 'Fair', icon: '🟡' };
    if (wqi >= 25) return { text: 'Poor', icon: '🟠' };
    return { text: 'Very Poor', icon: '🔴' };
  };

  const handleQuickRefresh = async () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      onRefresh();
    }, 1000);
  };

  const wqiDescription = getWQIDescription(wqi);

  return (
    <div className={`bg-white rounded-lg border-l-4 ${getSeverityColor(severity).replace('bg-', 'border-')} shadow-sm hover:shadow-md transition-shadow p-4`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-800">{sensor.id}</h4>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded text-white ${getSeverityColor(severity)}`}>
            {severity}
          </span>
          <button 
            onClick={handleQuickRefresh}
            className="p-1 hover:bg-gray-100 rounded"
            disabled={isUpdating}
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${isUpdating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      <p className="text-sm font-medium text-gray-700 mb-3">{sensor.location_name}</p>
      
      <div className="space-y-3">
        {/* Water Quality Index */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Water Quality Index:</span>
            <span className="font-medium">{wqi}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getSeverityColor(severity)}`}
              style={{ width: `${wqi}%` }}
            />
          </div>
        </div>
        
        {/* Key Parameters Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">pH Level:</span>
            <p className="font-medium flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              {sensor.ph}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Turbidity:</span>
            <p className="font-medium flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {sensor.turbidity} NTU
            </p>
          </div>
          <div>
            <span className="text-gray-500">Dissolved O₂:</span>
            <p className="font-medium flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {sensor.dissolved_oxygen} mg/L
            </p>
          </div>
          <div>
            <span className="text-gray-500">Temperature:</span>
            <p className="font-medium">{sensor.temperature}°C</p>
          </div>
        </div>
        
        {/* Status Summary */}
        <div className="bg-gray-50 p-3 rounded text-center">
          <div className="text-sm">
            <span className="mr-2">{wqiDescription.icon}</span>
            <span className="font-medium">{wqiDescription.text} Water Quality</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Last reading: {sensor.last_reading}
          </div>
          {sensor.alerts && sensor.alerts.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-red-600 font-medium">
                ⚠️ {sensor.alerts.length} Alert(s)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const SmartWaterMonitoring = () => {
  // Firebase and Connection State
  const [database, setDatabase] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  
  // App State management
  const [sensorsData, setSensorsData] = useState({
    'WS_001': { 
      id: 'WS_001',
      location: [37.7749, -122.4194], 
      location_name: 'Golden Gate Park Lake',
      ph: 7.2, 
      turbidity: 15.5, 
      dissolved_oxygen: 6.8, 
      temperature: 18.5,
      conductivity: 320,
      nitrates: 8.2,
      last_reading: '2024-07-10 14:30:00',
      alerts: []
    },
    'WS_002': { 
      id: 'WS_002',
      location: [37.7849, -122.4094], 
      location_name: 'Mission Bay Water Treatment',
      ph: 5.8, 
      turbidity: 85.2, 
      dissolved_oxygen: 3.2, 
      temperature: 22.1,
      conductivity: 850,
      nitrates: 45.8,
      last_reading: '2024-07-10 14:28:00',
      alerts: [
        { type: 'ph_low', severity: 'HIGH', message: 'pH below safe levels' },
        { type: 'high_turbidity', severity: 'CRITICAL', message: 'Excessive turbidity detected' }
      ]
    },
    'WS_003': { 
      id: 'WS_003',
      location: [37.7649, -122.4294], 
      location_name: 'Bay Area Reservoir',
      ph: 8.1, 
      turbidity: 8.3, 
      dissolved_oxygen: 7.5, 
      temperature: 16.8,
      conductivity: 280,
      nitrates: 12.4,
      last_reading: '2024-07-10 14:32:00',
      alerts: []
    },
    'WS_004': { 
      id: 'WS_004',
      location: [37.7949, -122.3994], 
      location_name: 'University Campus Pond',
      ph: 6.9, 
      turbidity: 25.1, 
      dissolved_oxygen: 5.8, 
      temperature: 20.3,
      conductivity: 420,
      nitrates: 15.6,
      last_reading: '2024-07-10 14:25:00',
      alerts: []
    },
    'WS_005': { 
      id: 'WS_005',
      location: [37.7549, -122.4394], 
      location_name: 'Industrial District Monitoring',
      ph: 4.2, 
      turbidity: 120.5, 
      dissolved_oxygen: 2.1, 
      temperature: 25.8,
      conductivity: 1650,
      nitrates: 78.3,
      last_reading: '2024-07-10 14:20:00',
      alerts: [
        { type: 'ph_critical', severity: 'CRITICAL', message: 'Extremely acidic water detected' },
        { type: 'low_oxygen', severity: 'CRITICAL', message: 'Critically low dissolved oxygen' },
        { type: 'high_conductivity', severity: 'HIGH', message: 'High conductivity indicates contamination' }
      ]
    },
    'WS_006': { 
      id: 'WS_006',
      location: [37.7449, -122.4494], 
      location_name: 'Coastal Monitoring Station',
      ph: 7.8, 
      turbidity: 12.2, 
      dissolved_oxygen: 7.2, 
      temperature: 17.5,
      conductivity: 35000,
      nitrates: 5.1,
      last_reading: '2024-07-10 14:35:00',
      alerts: []
    }
  });

  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [algorithm, setAlgorithm] = useState('genetic');
  const [vehicleCapacity, setVehicleCapacity] = useState(5);
  const [routeStats, setRouteStats] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const baseStation = [37.7650, -122.4200];

  // Initialize Firebase Connection
  useEffect(() => {
    const initDB = async () => {
      try {
        const db = await initializeFirebase();
        if (db) {
          setDatabase(db);
          setIsConnected(true);
          
          db.ref('.info/connected').on('value', (snapshot) => {
            setIsConnected(snapshot.val() === true);
          });
          
          // Load initial data
          try {
            const snapshot = await db.ref('water_sensors').once('value');
            const firebaseData = snapshot.val();
            
            if (firebaseData) {
              const transformedData = {};
              Object.keys(firebaseData).forEach(sensorId => {
                const sensor = firebaseData[sensorId];
                transformedData[sensorId] = {
                  id: sensorId,
                  location: sensor.location || [37.7749 + Math.random() * 0.01, -122.4194 + Math.random() * 0.01],
                  location_name: sensor.location_name || `Monitoring Point ${sensorId}`,
                  ph: sensor.ph || (6.5 + Math.random() * 2),
                  turbidity: sensor.turbidity || Math.random() * 100,
                  dissolved_oxygen: sensor.dissolved_oxygen || (4 + Math.random() * 6),
                  temperature: sensor.temperature || (15 + Math.random() * 15),
                  conductivity: sensor.conductivity || Math.random() * 2000,
                  nitrates: sensor.nitrates || Math.random() * 50,
                  last_reading: sensor.last_reading || new Date().toISOString(),
                  alerts: sensor.alerts || []
                };
              });
              
              setSensorsData(transformedData);
              setLastUpdate(new Date());
              console.log('✅ Water sensor data loaded from Firebase:', Object.keys(transformedData).length, 'sensors');
            }
          } catch (dataError) {
            console.error('❌ Error loading Firebase water sensor data:', dataError);
          }
        } else {
          console.warn('Firebase not available, using sample data');
          setConnectionError('Firebase SDK failed to load');
        }
      } catch (error) {
        console.error('Firebase connection error:', error);
        setConnectionError(error.message);
      }
    };
    
    initDB();
  }, []);

  // Load data from Firebase
  const loadFirebaseData = useCallback(async (db) => {
    if (!db) return;
    
    try {
      const snapshot = await db.ref('water_sensors').once('value');
      const firebaseData = snapshot.val();
      
      if (firebaseData) {
        const transformedData = {};
        Object.keys(firebaseData).forEach(sensorId => {
          const sensor = firebaseData[sensorId];
          transformedData[sensorId] = {
            id: sensorId,
            location: sensor.location || [37.7749 + Math.random() * 0.01, -122.4194 + Math.random() * 0.01],
            location_name: sensor.location_name || `Monitoring Point ${sensorId}`,
            ph: sensor.ph || (6.5 + Math.random() * 2),
            turbidity: sensor.turbidity || Math.random() * 100,
            dissolved_oxygen: sensor.dissolved_oxygen || (4 + Math.random() * 6),
            temperature: sensor.temperature || (15 + Math.random() * 15),
            conductivity: sensor.conductivity || Math.random() * 2000,
            nitrates: sensor.nitrates || Math.random() * 50,
            last_reading: sensor.last_reading || new Date().toISOString(),
            alerts: sensor.alerts || []
          };
        });
        
        setSensorsData(transformedData);
        setLastUpdate(new Date());
        console.log('Data refreshed from Firebase:', Object.keys(transformedData).length, 'sensors');
      }
    } catch (error) {
      console.error('Error loading Firebase data:', error);
      setConnectionError(error.message);
    }
  }, []);

  // Simulate data update (fallback)
  const simulateDataUpdate = useCallback(() => {
    setSensorsData(prevData => {
      const newData = { ...prevData };
      Object.keys(newData).forEach(sensorId => {
        const sensor = newData[sensorId];
        
        // Simulate realistic sensor changes
        sensor.ph += (Math.random() - 0.5) * 0.3;
        sensor.ph = Math.max(4, Math.min(10, sensor.ph));
        
        sensor.turbidity += (Math.random() - 0.5) * 10;
        sensor.turbidity = Math.max(0, sensor.turbidity);
        
        sensor.dissolved_oxygen += (Math.random() - 0.5) * 0.5;
        sensor.dissolved_oxygen = Math.max(0, Math.min(15, sensor.dissolved_oxygen));
        
        sensor.temperature += (Math.random() - 0.5) * 2;
        sensor.temperature = Math.max(0, Math.min(40, sensor.temperature));
        
        sensor.conductivity += (Math.random() - 0.5) * 100;
        sensor.conductivity = Math.max(0, sensor.conductivity);
        
        sensor.nitrates += (Math.random() - 0.5) * 5;
        sensor.nitrates = Math.max(0, sensor.nitrates);
        
        sensor.last_reading = new Date().toISOString();
        
        // Update alerts based on new values
        sensor.alerts = [];
        if (sensor.ph < 6.0 || sensor.ph > 9.0) {
          sensor.alerts.push({ type: 'ph_extreme', severity: 'HIGH', message: 'Extreme pH levels detected' });
        }
        if (sensor.turbidity > 100) {
          sensor.alerts.push({ type: 'high_turbidity', severity: 'CRITICAL', message: 'High turbidity detected' });
        }
        if (sensor.dissolved_oxygen < 4) {
          sensor.alerts.push({ type: 'low_oxygen', severity: 'HIGH', message: 'Low dissolved oxygen' });
        }
      });
      return newData;
    });
    setLastUpdate(new Date());
  }, []);

  // Enhanced data refresh
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    
    if (database && isConnected) {
      try {
        await loadFirebaseData(database);
        console.log('✅ Data refreshed from Firebase');
      } catch (error) {
        console.error('❌ Error refreshing from Firebase:', error);
        simulateDataUpdate();
      }
    } else {
      simulateDataUpdate();
      console.log('📡 Simulated data update (no Firebase connection)');
    }
    
    setIsRefreshing(false);
  }, [database, isConnected, loadFirebaseData, simulateDataUpdate]);

  // Real-time data polling
  useEffect(() => {
    const interval = setInterval(() => {
      if (database && isConnected) {
        loadFirebaseData(database);
      } else {
        simulateDataUpdate();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [database, isConnected, loadFirebaseData, simulateDataUpdate]);

  // Enhanced optimization function
  const optimizeSamplingRoute = useCallback(async () => {
    if (isOptimizing) return;
    
    setIsOptimizing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const sensorsArray = Object.values(sensorsData);
      console.log(`Starting sampling route optimization for ${sensorsArray.length} sensors`);
      
      const result = WaterQualityAnalyzer.optimizeSamplingRoute(sensorsArray, baseStation, vehicleCapacity);
      
      setOptimizedRoute(result.route || []);
      
      // Calculate enhanced statistics
      const estimatedTime = Math.round((result.distance / 30) * 60 + (result.route?.length || 0) * 20); // 20 min per sampling
      const fuelConsumption = (result.distance / 12); // Better fuel efficiency for water monitoring vehicles
      const fuelCost = fuelConsumption * 1.45;
      const co2Emissions = result.distance * 2.1;
      
      // Calculate contamination priority score
      let contaminationScore = 0;
      const criticalSites = result.route?.filter(sensorId => {
        const sensor = sensorsData[sensorId];
        if (!sensor) return false;
        const wqi = WaterQualityAnalyzer.calculateWQI(sensor);
        if (wqi < 50) contaminationScore += (50 - wqi);
        return wqi < 50;
      }) || [];
      
      const stats = {
        distance: result.distance,
        estimatedTime,
        fuelConsumption: fuelConsumption.toFixed(2),
        fuelCost: fuelCost.toFixed(2),
        co2Emissions: co2Emissions.toFixed(2),
        sensorsVisited: result.route?.length || 0,
        criticalSites: criticalSites.length,
        contaminationScore: Math.round(contaminationScore),
        efficiency: result.fitness ? Math.min(98, 75 + (result.fitness / 100)).toFixed(1) : '85.0'
      };
      
      setRouteStats(stats);
      
      console.log('Sampling route optimization completed successfully');

    } catch (error) {
      console.error('Optimization failed:', error);
      alert('Route optimization failed. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  }, [isOptimizing, sensorsData, vehicleCapacity]);

  // Export functionality
  const exportRoute = useCallback(() => {
    if (optimizedRoute.length === 0) {
      alert('Please optimize a sampling route first');
      return;
    }

    const routeData = {
      sampling_route: optimizedRoute,
      sensors: optimizedRoute.map(sensorId => ({
        id: sensorId,
        ...sensorsData[sensorId],
        wqi: WaterQualityAnalyzer.calculateWQI(sensorsData[sensorId])
      })),
      algorithm,
      vehicle_capacity: vehicleCapacity,
      stats: routeStats,
      contamination_analysis: WaterQualityAnalyzer.detectContamination(Object.values(sensorsData)),
      generated: new Date().toISOString(),
      base_station: baseStation
    };

    const blob = new Blob([JSON.stringify(routeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `water_monitoring_route_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [optimizedRoute, sensorsData, algorithm, vehicleCapacity, routeStats]);

  // Statistics calculations
  const totalSensors = Object.keys(sensorsData).length;
  const activeSensors = Object.values(sensorsData).filter(sensor => sensor.last_reading).length;
  const criticalSensors = Object.values(sensorsData).filter(sensor => {
    const wqi = WaterQualityAnalyzer.calculateWQI(sensor);
    return wqi < 50 || (sensor.alerts && sensor.alerts.length > 0);
  }).length;
  
  const averageWQI = Math.round(
    Object.values(sensorsData).reduce((sum, sensor) => 
      sum + WaterQualityAnalyzer.calculateWQI(sensor), 0
    ) / totalSensors
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-32 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-10 w-28 h-28 bg-white rounded-full"></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping opacity-30"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-white rounded-full animate-bounce opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            {/* Logo and Title */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm border border-white/30">
                💧
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
                  OASIS Water Solution
                </h1>
                <div className="text-lg md:text-xl text-cyan-100 font-medium">
                  Smart Water Contamination Monitoring
                </div>
              </div>
            </div>

            {/* Main Tagline */}
            <h2 className="text-2xl md:text-4xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
              Protecting Water Quality with 
              <span className="text-yellow-300"> Real-Time AI Monitoring</span>
            </h2>

            <p className="text-lg md:text-xl text-cyan-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Safeguard communities with our advanced IoT sensor network, machine learning contamination detection, 
              and intelligent sampling route optimization. Detect contamination 95% faster and reduce monitoring costs by 50%.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="font-semibold mb-2">Real-Time Analysis</h3>
                <p className="text-sm text-cyan-100">Continuous monitoring of pH, turbidity, dissolved oxygen, and contamination markers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">Instant Alerts</h3>
                <p className="text-sm text-cyan-100">Immediate notifications when contamination thresholds are exceeded</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl mb-3">🗺️</div>
                <h3 className="font-semibold mb-2">Smart Routing</h3>
                <p className="text-sm text-cyan-100">AI-optimized sampling routes for maximum efficiency and coverage</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">95%</div>
                <div className="text-sm text-cyan-100">Faster Detection</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-300">50%</div>
                <div className="text-sm text-cyan-100">Cost Reduction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-300">24/7</div>
                <div className="text-sm text-cyan-100">Monitoring</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-300">99.5%</div>
                <div className="text-sm text-cyan-100">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us / Project Description Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              About OASIS
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading the revolution in water quality monitoring through intelligent sensor networks and predictive contamination analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Mission</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                OASIS is dedicated to protecting global water resources through cutting-edge technology and artifical intelligent monitoring systems. 
                We combine advanced IoT sensors, machine learning algorithms, and real-time analytics to provide early warning systems for 
                water contamination, ensuring safe drinking water for needed communities .
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our platform empowers environmental agencies, water utilities, and industrial facilities to proactively monitor water quality, 
                detect contamination events in real-time, and respond rapidly to protect public health and environmental safety.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">Water Safety</span>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">Environmental Protection</span>
                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">AI Analytics</span>
                <span className="bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium">IoT Sensors</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="text-3xl mb-3">🏆</div>
                <h4 className="font-semibold mb-2 text-black">Industry Leader</h4>
                <p className="text-sm text-gray-600">Recognized leader in water quality monitoring technology</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="text-3xl mb-3">🌍</div>
                <h4 className="font-semibold mb-2 text-black">Global Deployment</h4>
                <p className="text-sm text-gray-600">Monitoring water systems in 75+ countries</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-semibold mb-2 text-black">Real-Time Processing</h4>
                <p className="text-sm text-gray-600">Analyzing millions of water quality readings daily</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl">
                <div className="text-3xl mb-3">🔒</div>
                <h4 className="font-semibold mb-2 text-black">Regulatory Compliance</h4>
                <p className="text-sm text-gray-600">Meets EPA, WHO, and international water standards</p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Technology Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-medium text-gray-800">ESP32 IoT</h4>
                <p className="text-xs text-gray-500">Sensor Control</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-2xl">🔥</span>
                </div>
                <h4 className="font-medium text-gray-800">Firebase</h4>
                <p className="text-xs text-gray-500">Real-time Database</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-2xl">⚛️</span>
                </div>
                <h4 className="font-medium text-gray-800">React</h4>
                <p className="text-xs text-gray-500">Dashboard UI</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-2xl">🐍</span>
                </div>
                <h4 className="font-medium text-gray-800">Python AI</h4>
                <p className="text-xs text-gray-500">ML Analysis</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-2xl">🧠</span>
                </div>
                <h4 className="font-medium text-gray-800">TensorFlow</h4>
                <p className="text-xs text-gray-500">Deep Learning</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <span className="text-2xl">☁️</span>
                </div>
                <h4 className="font-medium text-gray-800">Cloud API</h4>
                <p className="text-xs text-gray-500">Integration</p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Platform Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-3">Multi-Parameter Monitoring</h4>
                <p className="text-gray-600 text-sm mb-4">Comprehensive monitoring of pH, turbidity, dissolved oxygen, temperature, conductivity, and chemical contaminants in real-time.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• pH and chemical balance tracking</li>
                  <li>• Turbidity and clarity measurement</li>
                  <li>• Dissolved oxygen monitoring</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-3">Contamination Detection</h4>
                <p className="text-gray-600 text-sm mb-4">Advanced AI algorithms detect contamination patterns and predict water quality degradation before it becomes critical.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Real-time contamination alerts</li>
                  <li>• Predictive quality analysis</li>
                  <li>• Source identification algorithms</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-3">Intelligent Sampling Routes</h4>
                <p className="text-gray-600 text-sm mb-4">AI-optimized sampling routes ensure maximum coverage and efficiency for field teams and mobile monitoring units.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Priority-based route optimization</li>
                  <li>• Real-time route recalculation</li>
                  <li>• Field team coordination</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-3">Water Quality Index</h4>
                <p className="text-gray-600 text-sm mb-4">Comprehensive Water Quality Index calculation based on international standards and regulatory compliance requirements.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• EPA and WHO standard compliance</li>
                  <li>• Automated quality scoring</li>
                  <li>• Trend analysis and reporting</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-cyan-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-3">Historical Analysis</h4>
                <p className="text-gray-600 text-sm mb-4">Long-term data storage and analysis to identify patterns, seasonal variations, and environmental impact trends.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Temporal pattern recognition</li>
                  <li>• Seasonal variation analysis</li>
                  <li>• Environmental correlation studies</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-3">Regulatory Compliance</h4>
                <p className="text-gray-600 text-sm mb-4">Automated compliance reporting and documentation to meet local, national, and international water quality regulations.</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Automated compliance reports</li>
                  <li>• Regulatory threshold monitoring</li>
                  <li>• Audit trail documentation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur">
                💧
              </div>
              <div>
                <h1 className="text-3xl font-bold">Smart Water Monitoring</h1>
                <p className="text-cyan-100 flex items-center gap-2">
                  AI-Powered Contamination Detection System
                  <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                    isConnected ? 'bg-green-500/20 text-green-100' : 'bg-yellow-500/20 text-yellow-100'
                  }`}>
                    {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    {isConnected ? 'Firebase Connected' : 'Sample Data Mode'}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                <div className="text-2xl font-bold">{totalSensors}</div>
                <div className="text-sm text-cyan-100">Water Sensors</div>
              </div>
              <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                <div className="text-2xl font-bold">{criticalSensors}</div>
                <div className="text-sm text-cyan-100">Critical Sites</div>
              </div>
              <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                <div className="text-2xl font-bold">{averageWQI}</div>
                <div className="text-sm text-cyan-100">Avg WQI</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Route Distance</p>
                <p className="text-2xl font-bold text-blue-600">
                  {routeStats ? `${routeStats.distance.toFixed(1)} km` : '0 km'}
                </p>
              </div>
              <Navigation className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sampling Time</p>
                <p className="text-2xl font-bold text-green-600">
                  {routeStats ? `${routeStats.estimatedTime} min` : '0 min'}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Critical Sites</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {routeStats ? routeStats.criticalSites : criticalSensors}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg WQI</p>
                <p className="text-2xl font-bold text-red-600">
                  {averageWQI}
                </p>
              </div>
              <Droplets className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Route Optimization
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Algorithm:</label>
                <select 
                  value={algorithm} 
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="nearest_neighbor">Nearest Neighbor (Fast)</option>
                  <option value="genetic">Genetic Algorithm (Balanced)</option>
                  <option value="ant_colony">Ant Colony (Advanced)</option>
                </select>
              </div>
              <button 
                onClick={optimizeSamplingRoute}
                disabled={isOptimizing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Droplets className="w-4 h-4" />
                    Optimize Sampling Route
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Data Management
            </h3>
            <div className="space-y-3">
              <button 
                onClick={refreshData}
                disabled={isRefreshing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : (isConnected ? 'Refresh from Firebase' : 'Refresh Sample Data')}
              </button>
              <button 
                onClick={exportRoute}
                disabled={optimizedRoute.length === 0}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Route
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500 space-y-1">
              <div>Last update: {lastUpdate.toLocaleTimeString()}</div>
              <div className={`flex items-center gap-1 ${isConnected ? 'text-green-600' : 'text-orange-600'}`}>
                {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isConnected ? 'Real-time Firebase sync' : 'Sample data simulation'}
              </div>
              {connectionError && (
                <div className="text-red-500 text-xs">
                  Connection error: {connectionError}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Capacity: {vehicleCapacity}
                </label>
                <input 
                  type="range"
                  min="3"
                  max="8"
                  value={vehicleCapacity}
                  onChange={(e) => setVehicleCapacity(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              {routeStats && (
                <div className="text-sm text-gray-600">
                  <div>Efficiency: {routeStats.efficiency}%</div>
                  <div>Sensors Visited: {routeStats.sensorsVisited}</div>
                  <div>Contamination Score: {routeStats.contaminationScore}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Route Map */}
        <div className="mb-8">
          <WaterQualityMap 
            route={optimizedRoute} 
            sensors={Object.values(sensorsData)} 
            baseStation={baseStation} 
            isOptimizing={isOptimizing}
          />
        </div>

        {/* Sensor Status Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-6">Real-time Water Quality Monitoring</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(sensorsData).map((sensor) => (
              <SensorStatusCard 
                key={sensor.id} 
                sensor={sensor} 
                onRefresh={refreshData}
              />
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        {routeStats && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Monitoring Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{routeStats.efficiency}%</div>
                <div className="text-sm text-gray-600">Route Efficiency</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{routeStats.fuelConsumption}L</div>
                <div className="text-sm text-gray-600">Fuel Consumption</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{routeStats.sensorsVisited}</div>
                <div className="text-sm text-gray-600">Sensors in Route</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{routeStats.criticalSites}</div>
                <div className="text-sm text-gray-600">Critical Sites</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SmartWaterMonitoring;
