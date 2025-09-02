<?php

namespace App\Enums;

enum NigerianBanks: string
{
    case ACCESS_BANK = '044';
    case FIDELITY_BANK = '070';
    case FIRST_BANK = '011';
    case GT_BANK = '058';
    case KEYSTONE_BANK = '082';
    case MONEY_BOX = '012';
    case PARALLEX_BANK = '076';
    case POLARIS_BANK = '001';
    case STANDARD_CHARTERED_BANK = '068';
    case SUNTRUST_BANK = '068';
    case UNION_BANK = '032';
    case UNITY_BANK = '215';
    case WEMA_BANK = '035';
    case ZENITH_BANK = '057';
    case PROVIDUS_BANK = '101';
    case CITIBANK = '023';
    case HERITAGE_BANK = '030';
    case KEBS_BANK = '084';
    case SKYE_BANK = '076';
    case STANBIC_IBTC_BANK = '221';
    case JAIZ_BANK = '301';
    case DIAMOND_BANK = '063';
    case KUDA_BANK = '090267';
    case MONIEPOINT_BANK = '50515';
    case OPAY_BANK = '999992';
    case PALMPAY_BANK = '999991';

    public function label(): string
    {
        return match ($this) {
            self::ACCESS_BANK => 'Access Bank',
            self::FIDELITY_BANK => 'Fidelity Bank',
            self::FIRST_BANK => 'First Bank',
            self::GT_BANK => 'GT Bank',
            self::KEYSTONE_BANK => 'Keystone Bank',
            self::MONEY_BOX => 'Money Box',
            self::PARALLEX_BANK => 'Parallex Bank',
            self::POLARIS_BANK => 'Polaris Bank',
            self::STANDARD_CHARTERED_BANK => 'Standard Chartered Bank',
            self::SUNTRUST_BANK => 'Suntrust Bank',
            self::UNION_BANK => 'Union Bank',
            self::UNITY_BANK => 'Unity Bank',
            self::WEMA_BANK => 'Wema Bank',
            self::ZENITH_BANK => 'Zenith Bank',
            self::PROVIDUS_BANK => 'Provus Bank',
            self::CITIBANK => 'Citibank',
            self::HERITAGE_BANK => 'Heritage Bank',
            self::KEBS_BANK => 'Kebs Bank',
            self::SKYE_BANK => 'Skye Bank',
            self::STANBIC_IBTC_BANK => 'Stanbic IBTC Bank',
            self::JAIZ_BANK => 'Jaiz Bank',
            self::DIAMOND_BANK => 'Diamond Bank',
            self::KUDA_BANK => 'Kuda Bank',
            self::MONIEPOINT_BANK => 'Moniepoint MFB',
            self::OPAY_BANK => 'Opay',
            self::PALMPAY_BANK => 'Palmpay',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
