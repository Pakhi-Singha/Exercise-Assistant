import 'package:flutter/material.dart';

void main() {
  runApp(ProteinCalculatorApp());
}

class ProteinCalculatorApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Protein Calculator',
      theme: ThemeData(
        primarySwatch: Colors.teal,
      ),
      home: ProteinCalculatorScreen(),
    );
  }
}

class ProteinCalculatorScreen extends StatefulWidget {
  @override
  _ProteinCalculatorScreenState createState() => _ProteinCalculatorScreenState();
}

class _ProteinCalculatorScreenState extends State<ProteinCalculatorScreen> {
  final _weightController = TextEditingController();
  String? _selectedActivityLevel;
  String? _selectedGoal;
  String? _result;

  final Map<String, double> activityMultipliers = {
    "sedentary": 0.8,
    "light": 1.0,
    "moderate": 1.3,
    "active": 1.6,
    "athlete": 2.0
  };

  void _calculateProtein() {
    final weight = double.tryParse(_weightController.text);
    final activityMultiplier = _selectedActivityLevel != null
        ? activityMultipliers[_selectedActivityLevel!]
        : null;

    if (weight == null || activityMultiplier == null || _selectedGoal == null) {
      setState(() {
        _result = "⚠️ Please fill in all fields correctly.";
      });
      return;
    }

    double baseProtein = weight * activityMultiplier;
    double dailyProtein;

    switch (_selectedGoal) {
      case "gain":
        dailyProtein = baseProtein * 1.2;
        break;
      case "lose":
        dailyProtein = baseProtein * 1.1;
        break;
      default:
        dailyProtein = baseProtein;
    }

    setState(() {
      _result = "👉 Your estimated daily protein requirement is: ${dailyProtein.toStringAsFixed(2)} grams.";
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Protein Intake Calculator'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _weightController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                labelText: 'Weight (kg)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedActivityLevel,
              decoration: InputDecoration(
                labelText: 'Activity Level',
                border: OutlineInputBorder(),
              ),
              items: activityMultipliers.keys.map((level) {
                return DropdownMenuItem(
                  value: level,
                  child: Text(level[0].toUpperCase() + level.substring(1)),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedActivityLevel = value;
                });
              },
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: _selectedGoal,
              decoration: InputDecoration(
                labelText: 'Fitness Goal',
                border: OutlineInputBorder(),
              ),
              items: ['maintain', 'gain', 'lose'].map((goal) {
                return DropdownMenuItem(
                  value: goal,
                  child: Text(goal[0].toUpperCase() + goal.substring(1)),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedGoal = value;
                });
              },
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _calculateProtein,
              child: Text('Calculate Protein'),
            ),
            const SizedBox(height: 20),
            if (_result != null)
              Text(
                _result!,
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
          ],
        ),
      ),
    );
  }
}
