import 'package:flutter/material.dart';

class JourneyScreen extends StatelessWidget {
  const JourneyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Journey'),
      ),
      body: const Center(
        child: Text('Journey Screen - TODO: Implement progress tracking'),
      ),
    );
  }
}
