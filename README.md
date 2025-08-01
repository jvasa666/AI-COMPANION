# AI Companion × Qloo Hackathon Submission
**Cultural-Aware AI Avatars Powered by Taste AI™**

![Demo](https://ai-companion-qloo.vercel.app/demo.gif)

## 🚀 Key Features
- **Qloo-Powered Personalities**  
  ```python
  # Map cultural clusters to avatar traits
  def set_personality(qloo_cluster):
      traits = {
          'music_pref': qloo_cluster['top_music_genre'],
          'humor_style': 'deadpan' if 'goth' in qloo_cluster['subcultures'] else 'warm'
      }
      return traits
