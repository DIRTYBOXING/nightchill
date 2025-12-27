import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  GoogleMapController? _mapController;
  Position? _currentPosition;
  Set<Marker> _markers = {};
  List<String> _selectedTags = [];

  @override
  void initState() {
    super.initState();
    _getCurrentLocation();
    _loadLocations();
  }

  Future<void> _getCurrentLocation() async {
    final permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied) {
      return;
    }

    final position = await Geolocator.getCurrentPosition();
    setState(() {
      _currentPosition = position;
    });

    _mapController?.animateCamera(
      CameraUpdate.newLatLng(
        LatLng(position.latitude, position.longitude),
      ),
    );
  }

  Future<void> _loadLocations() async {
    final snapshot = await FirebaseFirestore.instance
        .collection('locations')
        .where('verified', isEqualTo: true)
        .get();

    final markers = <Marker>{};

    for (var doc in snapshot.docs) {
      final data = doc.data();
      final geopoint = data['geopoint'] as GeoPoint;

      // Filter by selected tags if any
      if (_selectedTags.isNotEmpty) {
        final supportTags = List<String>.from(data['supportTags'] ?? []);
        if (!supportTags.any((tag) => _selectedTags.contains(tag))) {
          continue;
        }
      }

      markers.add(
        Marker(
          markerId: MarkerId(doc.id),
          position: LatLng(geopoint.latitude, geopoint.longitude),
          infoWindow: InfoWindow(
            title: data['name'],
            snippet: data['type'],
          ),
          icon: _getMarkerIcon(data['type']),
          onTap: () => _showLocationDetails(context, doc.id, data),
        ),
      );
    }

    setState(() {
      _markers = markers;
    });
  }

  BitmapDescriptor _getMarkerIcon(String type) {
    // TODO: Use custom icons for different types
    return BitmapDescriptor.defaultMarker;
  }

  void _showLocationDetails(BuildContext context, String locationId, Map<String, dynamic> data) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              data['name'],
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(data['description'] ?? ''),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              children: (data['supportTags'] as List<dynamic>)
                  .map((tag) => Chip(label: Text(tag.toString())))
                  .toList(),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      // TODO: Open directions
                    },
                    icon: const Icon(Icons.directions),
                    label: const Text('Directions'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      _checkIn(context, locationId);
                    },
                    icon: const Icon(Icons.check_circle),
                    label: const Text('Check In'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _checkIn(BuildContext context, String locationId) async {
    // TODO: Implement check-in logic with batch write
    Navigator.pop(context);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Checked in successfully!')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Find Support'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () => _showFilterSheet(context),
          ),
        ],
      ),
      body: _currentPosition == null
          ? const Center(child: CircularProgressIndicator())
          : GoogleMap(
              initialCameraPosition: CameraPosition(
                target: LatLng(
                  _currentPosition!.latitude,
                  _currentPosition!.longitude,
                ),
                zoom: 14,
              ),
              onMapCreated: (controller) {
                _mapController = controller;
              },
              markers: _markers,
              myLocationEnabled: true,
              myLocationButtonEnabled: true,
            ),
    );
  }

  void _showFilterSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Filter by Support Tags',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              children: [
                FilterChip(
                  label: const Text('☕ Coffee Support'),
                  selected: _selectedTags.contains('Coffee Support'),
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        _selectedTags.add('Coffee Support');
                      } else {
                        _selectedTags.remove('Coffee Support');
                      }
                    });
                    _loadLocations();
                    Navigator.pop(context);
                  },
                ),
                FilterChip(
                  label: const Text('🤝 Mentor-Safe'),
                  selected: _selectedTags.contains('Mentor-Safe'),
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        _selectedTags.add('Mentor-Safe');
                      } else {
                        _selectedTags.remove('Mentor-Safe');
                      }
                    });
                    _loadLocations();
                    Navigator.pop(context);
                  },
                ),
                FilterChip(
                  label: const Text('🛡️ Anxiety-Friendly'),
                  selected: _selectedTags.contains('Anxiety-Friendly'),
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        _selectedTags.add('Anxiety-Friendly');
                      } else {
                        _selectedTags.remove('Anxiety-Friendly');
                      }
                    });
                    _loadLocations();
                    Navigator.pop(context);
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
