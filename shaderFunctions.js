const shaderFunctions = `
float positive_dot(vec3 left, vec3 right) {
    return max(dot(left, right), 0.0);
}
        
float lambert(vec3 normal, vec3 lightPosition, float power) {
    vec3 lightDirection = normalize(lightPosition);

    // Рассчитываем интенсивность освещения по модели Ламберта
    float diffuse = max(dot(normal, lightDirection), 0.0);
    
    return diffuse * power;
}
        
float phong(vec3 normal, vec3 lightDir, vec3 viewPosition, float power, float shininess) {
    vec3 lightDirection = normalize(lightDir);
    vec3 viewDirection = normalize(-viewPosition);
    
    // Рассчитываем направление отраженного света
    vec3 reflectionVector = normalize(reflect(-lightDirection, normal));
    
    // Рассчитываем интенсивность отраженного света
    float diffuse = max(dot(normal, lightDirection), 0.0);
    float specular = pow(max(dot(reflectionVector, viewDirection), 0.0), shininess);
    
    return (diffuse + specular) * power;
}
        
float selShaded(vec3 normal, vec3 lightPosition, float power) {
    vec3 lightDirection = normalize(lightPosition);
    float intensity = max(0.0, dot(normal, lightDirection));
    float coefficient;

    if (intensity >= 0.95) {
        coefficient = 1.0;
    } else if (intensity >= 0.5) {
        coefficient = 0.7;
    } else if (intensity >= 0.2) {
        coefficient = 0.4;
    } else {
        coefficient = 0.1;
    }

    return coefficient * power;
    
}
        
float evaluateLighting(int shading, int current, int lightModel, vec3 normal, vec4 vertex,
                        vec3 lightDir, vec3 viewPosition, float power, float shininess) 
{
    float light = 1.0;
    if (shading == current) 
{
        if (lightModel == 0) {
            light = lambert(normal, lightDir, power);   
        } else if (lightModel == 1) {
            light = phong(normal, lightDir, viewPosition, power, shininess);
        } else if (lightModel == 2){
            light = selShaded(normal, lightDir, power);
        }
    }
    return light;
}
        
float dampLight(int dampingFunction, float light) {
    if (dampingFunction == 0) {
        return light;   
    }
    else if (dampingFunction == 1) {
        return light*light;
    }
}`

export default shaderFunctions;