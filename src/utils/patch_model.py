import json

def trapatch_tfjs_model_json(model_json_path, verbose=True):
    """
    Fix TFJS model.json issues:
    1. Remove Sequential name prefix from weights
    2. Normalize model name (sequential → model)
    3. Fix InputLayer batch_shape → batchInputShape
    """

    with open(model_json_path, 'r') as f:
        model_json = json.load(f)

    model_cfg = model_json['modelTopology']['model_config']['config']

    # -------------------------------------------------
    # 1. FIX MODEL NAME (important for weight prefixes)
    # -------------------------------------------------
    old_name = model_cfg.get('name', '')

    if old_name == "sequential":
        model_cfg['name'] = "model"
        if verbose:
            print(f"✓ Renamed model: {old_name} → model")

    # -------------------------------------------------
    # 2. FIX INPUT LAYER
    # -------------------------------------------------
    layers = model_cfg.get('layers', [])

    for layer in layers:
        if layer.get('class_name') == 'InputLayer':
            cfg = layer.get('config', {})

            if 'batch_shape' in cfg:
                cfg['batchInputShape'] = cfg['batch_shape']
                cfg.pop('batch_shape', None)

                if verbose:
                    print("✓ Fixed InputLayer: batch_shape → batchInputShape")

    # -------------------------------------------------
    # 3. FIX WEIGHT NAMES
    # -------------------------------------------------
    prefix = f"{old_name}/" if old_name else ""

    for manifest in model_json.get('weightsManifest', []):
        for weight in manifest.get('weights', []):
            name = weight.get('name', '')

            if name.startswith(prefix):
                new_name = name[len(prefix):]
                weight['name'] = new_name

                if verbose:
                    print(f"✓ Weight: {name} → {new_name}")

    # -------------------------------------------------
    # SAVE PATCHED FILE
    # -------------------------------------------------
    with open(model_json_path, 'w') as f:
        json.dump(model_json, f, indent=2)

    if verbose:
        print("✓ model.json fully patched successfully")

    return model_json