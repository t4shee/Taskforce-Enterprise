def analyze_ciphers(protocol_data: dict):
    """
    Analyze supported cipher suites and extract
    encryption, hash, mode, and key exchange information.
    """

    cipher_suites = protocol_data.get("supported_cipher_suites", [])

    encryption_algorithms = set()
    hash_algorithms = set()
    modes = set()
    key_exchange_methods = set()

    weak_ciphers = []

    for cipher in cipher_suites:

        encryption = cipher.get("encryption_algorithm")
        hash_algo = cipher.get("hash_algorithm")
        mode = cipher.get("mode")
        key_exchange = cipher.get("key_exchange")

        if encryption:
            encryption_algorithms.add(encryption)

        if hash_algo:
            hash_algorithms.add(hash_algo)

        if mode:
            modes.add(mode)

        if key_exchange:
            key_exchange_methods.add(key_exchange)

        # Detect weak cipher patterns
        if mode == "CBC" or hash_algo == "SHA":
            weak_ciphers.append(cipher.get("name"))

    cipher_info = {
        "total_ciphers": len(cipher_suites),
        "encryption_algorithms": list(encryption_algorithms),
        "hash_algorithms": list(hash_algorithms),
        "modes": list(modes),
        "key_exchange_methods": list(key_exchange_methods),
        "weak_cipher_count": len(weak_ciphers),
        "weak_ciphers": weak_ciphers
    }

    return cipher_info# Placeholder file for cipher_analyzer.py
