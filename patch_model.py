import json

model_json_path = TFJS_DIR / 'model.json'
with open(model_json_path, 'r') as f:
    model_json = json.load(f)

# Patch 1: add batchInputShape for TF.js InputLayer compatibility
layers = model_json['modelTopology']['model_config']['config']['layers']
for layer in layers:
    if layer['class_name'] == 'InputLayer':
        cfg = layer['config']
        if 'batch_shape' in cfg and 'batchInputShape' not in cfg:
            cfg['batchInputShape'] = cfg['batch_shape']
            print('✓ Patched InputLayer: added batchInputShape')

# Patch 2: strip model name prefix from weight names
model_name = model_json['modelTopology']['model_config']['config']['name']
for manifest in model_json['weightsManifest']:
    for weight in manifest['weights']:
        if weight['name'].startswith(f"{model_name}/"):
            weight['name'] = weight['name'][len(f"{model_name}/"):]
            print(f"✓ Patched weight name: {weight['name']}")

with open(model_json_path, 'w') as f:
    json.dump(model_json, f, indent=2)

print('✓ model.json patched successfully')
