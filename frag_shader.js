import shaderFunctions from "./shaderFunctions.js";

var cubeFragmentShader = `precision mediump float;
uniform mat4 uModelViewMatrix;

varying vec4 vPosition;
varying vec4 vColor;
varying vec3 vNormal;

uniform float uLightPower;
uniform vec3 uLightDirection;
uniform lowp int uDampingFunction;
uniform lowp int uShading;
uniform lowp int uLightModel;
uniform float uLightShininess;
${shaderFunctions}
void main(void) {
    vec3 positionEye3 = vec3(uModelViewMatrix * vPosition);
    vec3 lightDirection = normalize(uLightDirection - positionEye3);

    int current = 0;

    float light = evaluateLighting(
        uShading, current, uLightModel, vNormal, vPosition,
        lightDirection, positionEye3, uLightPower, uLightShininess);
    light = dampLight(uDampingFunction, light);

    gl_FragColor = vColor;
    gl_FragColor.rgb *= light;
}`

export default cubeFragmentShader;