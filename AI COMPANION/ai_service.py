using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class AvatarController : MonoBehaviour
{
    public GameObject avatarModel;
    private SkinnedMeshRenderer[] bodyRenderers;
    
    // Body shape parameters
    private float bodyShape = 50f;
    private float breastSize = 50f;
    private float hipWidth = 50f;
    
    void Start()
    {
        // Get all skinned mesh renderers in the avatar
        bodyRenderers = avatarModel.GetComponentsInChildren<SkinnedMeshRenderer>();
        
        // Initialize body shape
        UpdateBodyShape();
    }
    
    public void UpdateBodyParams(string jsonParams)
    {
        // Parse JSON parameters
        BodyParams parameters = JsonUtility.FromJson<BodyParams>(jsonParams);
        
        bodyShape = parameters.bodyShape;
        breastSize = parameters.breastSize;
        hipWidth = parameters.hipWidth;
        
        UpdateBodyShape();
    }
    
    private void UpdateBodyShape()
    {
        foreach (var renderer in bodyRenderers)
        {
            // Update blend shapes based on parameters
            if (renderer.sharedMesh.blendShapeCount > 0)
            {
                // Body shape blend shapes (adjust indices based on your model)
                renderer.SetBlendShapeWeight(0, bodyShape); // Body type
                renderer.SetBlendShapeWeight(1, breastSize); // Breast size
                renderer.SetBlendShapeWeight(2, hipWidth); // Hip width
            }
        }
    }
    
    [System.Serializable]
    private class BodyParams
    {
        public float bodyShape;
        public float breastSize;
        public float hipWidth;
    }
}