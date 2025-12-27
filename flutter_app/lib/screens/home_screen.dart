import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // TODO: Get current user from Firebase Auth
    const String currentUserId = 'demo-user-id';

    return Scaffold(
      appBar: AppBar(
        title: const Text('NightChill'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // TODO: Navigate to settings
            },
          ),
        ],
      ),
      body: StreamBuilder<DocumentSnapshot>(
        stream: FirebaseFirestore.instance
            .collection('users')
            .doc(currentUserId)
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || !snapshot.data!.exists) {
            return const Center(child: Text('User not found'));
          }

          final userData = snapshot.data!.data() as Map<String, dynamic>;
          final currentStreak = userData['currentStreak'] ?? 0;
          final totalPoints = userData['totalPoints'] ?? 0;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Streak Card
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        Column(
                          children: [
                            const Text('🔥', style: TextStyle(fontSize: 40)),
                            const SizedBox(height: 8),
                            Text(
                              '$currentStreak days',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const Text('Current Streak'),
                          ],
                        ),
                        Column(
                          children: [
                            const Text('⭐', style: TextStyle(fontSize: 40)),
                            const SizedBox(height: 8),
                            Text(
                              '$totalPoints',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const Text('Total Points'),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Check-in Button
                SizedBox(
                  width: double.infinity,
                  height: 60,
                  child: ElevatedButton(
                    onPressed: () {
                      _showCheckInDialog(context);
                    },
                    child: const Text(
                      'Daily Check-In',
                      style: TextStyle(fontSize: 18),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Quick Actions
                Text(
                  'Quick Actions',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _QuickActionButton(
                      icon: Icons.location_on,
                      label: 'Find Gym',
                      onTap: () {
                        // Switch to Map tab
                        // TODO: Implement tab switching
                      },
                    ),
                    _QuickActionButton(
                      icon: Icons.people,
                      label: 'Mentor',
                      onTap: () {
                        // Switch to Chat tab
                        // TODO: Implement tab switching
                      },
                    ),
                    _QuickActionButton(
                      icon: Icons.emoji_events,
                      label: 'Rewards',
                      onTap: () {
                        // Switch to Rewards tab
                        // TODO: Implement tab switching
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Recent Activity
                Text(
                  'Recent Activity',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 12),
                StreamBuilder<QuerySnapshot>(
                  stream: FirebaseFirestore.instance
                      .collection('checkins')
                      .where('userId', isEqualTo: currentUserId)
                      .orderBy('checkedInAt', descending: true)
                      .limit(3)
                      .snapshots(),
                  builder: (context, snapshot) {
                    if (!snapshot.hasData) {
                      return const Center(child: CircularProgressIndicator());
                    }

                    final checkins = snapshot.data!.docs;

                    if (checkins.isEmpty) {
                      return const Card(
                        child: Padding(
                          padding: EdgeInsets.all(16),
                          child: Text('No recent activity. Check in to get started!'),
                        ),
                      );
                    }

                    return Column(
                      children: checkins.map((doc) {
                        final data = doc.data() as Map<String, dynamic>;
                        return Card(
                          child: ListTile(
                            leading: const Icon(Icons.check_circle, color: Colors.green),
                            title: Text(data['locationType'] ?? 'Check-in'),
                            subtitle: Text(
                              _formatTimestamp(data['checkedInAt']),
                            ),
                            trailing: Text(
                              '+${data['pointsEarned']} pts',
                              style: const TextStyle(
                                color: Colors.green,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    );
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  void _showCheckInDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Daily Check-In'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('How are you feeling today?'),
            // TODO: Add mood selection buttons
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              // TODO: Implement check-in logic
              Navigator.pop(context);
            },
            child: const Text('Check In'),
          ),
        ],
      ),
    );
  }

  String _formatTimestamp(dynamic timestamp) {
    if (timestamp == null) return 'Unknown';
    final DateTime dateTime = (timestamp as Timestamp).toDate();
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else {
      return '${difference.inDays} days ago';
    }
  }
}

class _QuickActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, size: 32),
          ),
          const SizedBox(height: 8),
          Text(label),
        ],
      ),
    );
  }
}
