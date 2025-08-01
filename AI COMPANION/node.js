import 'package:flutter/material.dart';
import 'package:flutter_unity_widget/flutter_unity_widget.dart';
import 'package:camera/camera.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final cameras = await availableCameras();
  runApp(AICompanionApp(cameras: cameras));
}

class AICompanionApp extends StatelessWidget {
  final List<CameraDescription> cameras;
  
  const AICompanionApp({Key? key, required this.cameras}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Companion',
      theme: ThemeData(
        primarySwatch: Colors.deepPurple,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: AgeVerificationScreen(cameras: cameras),
    );
  }
}

class AgeVerificationScreen extends StatefulWidget {
  final List<CameraDescription> cameras;
  
  const AgeVerificationScreen({Key? key, required this.cameras}) : super(key: key);

  @override
  _AgeVerificationScreenState createState() => _AgeVerificationScreenState();
}

class _AgeVerificationScreenState extends State<AgeVerificationScreen> {
  DateTime? selectedDate;
  bool nsfwAllowed = false;

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Age Verification')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text('You must be 18+ to use this app'),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => _selectDate(context),
              child: Text(selectedDate == null 
                ? 'Select Birth Date' 
                : 'Birthday: ${selectedDate!.toLocal()}'.split(' ')[0]),
            ),
            SizedBox(height: 20),
            CheckboxListTile(
              title: Text('Allow NSFW content'),
              value: nsfwAllowed,
              onChanged: (bool? value) {
                setState(() {
                  nsfwAllowed = value ?? false;
                });
              },
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                if (selectedDate != null && 
                    DateTime.now().difference(selectedDate!).inDays ~/ 365 >= 18) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => AvatarCreationScreen(
                        cameras: widget.cameras,
                        nsfwAllowed: nsfwAllowed,
                      ),
                    ),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('You must be at least 18 years old')),
                  );
                }
              },
              child: Text('Continue')),
          ],
        ),
      ),
    );
  }
}

class AvatarCreationScreen extends StatefulWidget {
  final List<CameraDescription> cameras;
  final bool nsfwAllowed;
  
  const AvatarCreationScreen({
    Key? key,
    required this.cameras,
    required this.nsfwAllowed,
  }) : super(key: key);

  @override
  _AvatarCreationScreenState createState() => _AvatarCreationScreenState();
}

class _AvatarCreationScreenState extends State<AvatarCreationScreen> {
  late UnityWidgetController _unityController;
  double _bodyShapeValue = 50;
  double _breastSizeValue = 50;
  double _hipWidthValue = 50;
  String _selectedVoice = 'Default';

  void _updateUnityModel() {
    _unityController.postMessage(
      'AvatarController',
      'UpdateBodyParams',
      jsonEncode({
        'bodyShape': _bodyShapeValue,
        'breastSize': widget.nsfwAllowed ? _breastSizeValue : 0,
        'hipWidth': _hipWidthValue,
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Create Your Companion')),
      body: Column(
        children: [
          Expanded(
            flex: 2,
            child: UnityWidget(
              onUnityCreated: (controller) {
                _unityController = controller;
              },
            ),
          ),
          Expanded(
            flex: 3,
            child: ListView(
              children: [
                _buildSlider('Body Shape', _bodyShapeValue, (value) {
                  setState(() => _bodyShapeValue = value);
                  _updateUnityModel();
                }),
                if (widget.nsfwAllowed)
                  _buildSlider('Breast Size', _breastSizeValue, (value) {
                    setState(() => _breastSizeValue = value);
                    _updateUnityModel();
                  }),
                _buildSlider('Hip Width', _hipWidthValue, (value) {
                  setState(() => _hipWidthValue = value);
                  _updateUnityModel();
                }),
                Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Voice Style'),
                      DropdownButton<String>(
                        value: _selectedVoice,
                        items: ['Default', 'Sultry', 'Sweet', 'Professional']
                            .map((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          );
                        }).toList(),
                        onChanged: (String? newValue) {
                          setState(() {
                            _selectedVoice = newValue!;
                          });
                        },
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ChatScreen(
                          avatarParams: {
                            'bodyShape': _bodyShapeValue,
                            'breastSize': _breastSizeValue,
                            'hipWidth': _hipWidthValue,
                          },
                          voiceStyle: _selectedVoice,
                          nsfwAllowed: widget.nsfwAllowed,
                        ),
                      ),
                    );
                  },
                  child: Text('Start Chatting')),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSlider(String label, double value, Function(double) onChanged) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label),
          Slider(
            value: value,
            min: 0,
            max: 100,
            divisions: 100,
            label: value.round().toString(),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}

class ChatScreen extends StatefulWidget {
  final Map<String, dynamic> avatarParams;
  final String voiceStyle;
  final bool nsfwAllowed;
  
  const ChatScreen({
    Key? key,
    required this.avatarParams,
    required this.voiceStyle,
    required this.nsfwAllowed,
  }) : super(key: key);

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _textController = TextEditingController();
  final List<ChatMessage> _messages = [];
  bool _isTyping = false;

  void _handleSubmitted(String text) async {
    _textController.clear();
    
    setState(() {
      _messages.add(ChatMessage(
        text: text,
        isUser: true,
      ));
      _isTyping = true;
    });

    // Simulate API call
    await Future.delayed(Duration(seconds: 1));
    
    setState(() {
      _messages.add(ChatMessage(
        text: "This is a simulated response from your AI companion.",
        isUser: false,
      ));
      _isTyping = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('AI Companion')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.all(8),
              itemCount: _messages.length,
              itemBuilder: (context, i) => _messages[i],
            ),
          ),
          if (_isTyping)
            Padding(
              padding: EdgeInsets.all(8),
              child: Text('Companion is typing...'),
            ),
          Divider(height: 1),
          Container(
            decoration: BoxDecoration(color: Theme.of(context).cardColor),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _textController,
                    decoration: InputDecoration(
                      hintText: 'Type your message...',
                      contentPadding: EdgeInsets.all(12),
                      border: InputBorder.none,
                    ),
                    onSubmitted: _handleSubmitted,
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.send),
                  onPressed: () => _handleSubmitted(_textController.text),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class ChatMessage extends StatelessWidget {
  final String text;
  final bool isUser;

  const ChatMessage({Key? key, required this.text, required this.isUser})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          isUser
              ? Container()
              : CircleAvatar(
                  child: Text('AI'),
                  backgroundColor: Colors.deepPurple,
                ),
          Expanded(
            child: Container(
              margin: EdgeInsets.only(
                left: isUser ? 0 : 8,
                right: isUser ? 8 : 0,
              ),
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isUser
                    ? Colors.deepPurple.withOpacity(0.2)
                    : Colors.grey.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(text),
            ),
          ),
          isUser
              ? CircleAvatar(
                  child: Text('You'),
                  backgroundColor: Colors.blue,
                )
              : Container(),
        ],
      ),
    );
  }
}