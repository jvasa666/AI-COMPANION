// COMPLETE FLUTTER APP
import 'package:flutter/material.dart';

void main() => runApp(const AICompanionApp());

class AICompanionApp extends StatelessWidget {
  const AICompanionApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Companion',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: Scaffold(
        appBar: AppBar(title: const Text('AI Companion')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('Customizable AI Assistant',
                style: TextStyle(fontSize: 24)),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => print('Launching companion...'),
                child: const Text('Start Session'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
