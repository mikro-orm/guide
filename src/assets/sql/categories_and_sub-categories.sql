-- Insert main categories
INSERT INTO category (id, name) VALUES
                                    (uuid(), 'KULTUUR'),
                                    (uuid(), 'MAJANDUS'),
                                    (uuid(), 'POLIITIKA'),
                                    (uuid(), 'SÕJANDUS'),
                                    (uuid(), 'MEDITSIIN'),
                                    (uuid(), 'HARIDUS'),
                                    (uuid(), 'RELIGIOON');

-- Insert sub-categories for KULTUUR
INSERT INTO sub_category (id, category_id, name)
SELECT uuid(), id, 'kunst' FROM category WHERE name = 'KULTUUR'
UNION ALL
SELECT uuid(), id, 'kirjandus' FROM category WHERE name = 'KULTUUR'
UNION ALL
SELECT uuid(), id, 'ajakirjandus' FROM category WHERE name = 'KULTUUR'
UNION ALL
SELECT uuid(), id, 'arhitektuur' FROM category WHERE name = 'KULTUUR'
UNION ALL
SELECT uuid(), id, 'muusika' FROM category WHERE name = 'KULTUUR'
UNION ALL
SELECT uuid(), id, 'teater' FROM category WHERE name = 'KULTUUR'
UNION ALL
SELECT uuid(), id, 'rahvakultuur' FROM category WHERE name = 'KULTUUR'
UNION ALL
SELECT uuid(), id, 'seltsitegevus' FROM category WHERE name = 'KULTUUR'
UNION ALL
SELECT uuid(), id, 'sport' FROM category WHERE name = 'KULTUUR';

-- Insert sub-categories for MAJANDUS
INSERT INTO sub_category (id, category_id, name)
SELECT uuid(), id, 'tööstus' FROM category WHERE name = 'MAJANDUS'
UNION ALL
SELECT uuid(), id, 'põllumajandus' FROM category WHERE name = 'MAJANDUS'
UNION ALL
SELECT uuid(), id, 'laevandus' FROM category WHERE name = 'MAJANDUS'
UNION ALL
SELECT uuid(), id, 'kaubandus' FROM category WHERE name = 'MAJANDUS'
UNION ALL
SELECT uuid(), id, 'transport' FROM category WHERE name = 'MAJANDUS'
UNION ALL
SELECT uuid(), id, 'ehitus' FROM category WHERE name = 'MAJANDUS'
UNION ALL
SELECT uuid(), id, 'rahandus' FROM category WHERE name = 'MAJANDUS';

-- Insert sub-categories for POLIITIKA
INSERT INTO sub_category (id, category_id, name)
SELECT uuid(), id, 'riigivõim' FROM category WHERE name = 'POLIITIKA'
UNION ALL
SELECT uuid(), id, 'kohalik võim' FROM category WHERE name = 'POLIITIKA'
UNION ALL
SELECT uuid(), id, 'võõrvõim' FROM category WHERE name = 'POLIITIKA';

-- Insert sub-categories for SÕJANDUS
INSERT INTO sub_category (id, category_id, name)
SELECT uuid(), id, 'riigikaitse' FROM category WHERE name = 'SÕJANDUS'
UNION ALL
SELECT uuid(), id, 'võõrvallutus' FROM category WHERE name = 'SÕJANDUS';

-- Insert sub-categories for HARIDUS
INSERT INTO sub_category (id, category_id, name)
SELECT uuid(), id, 'üldharidus' FROM category WHERE name = 'HARIDUS'
UNION ALL
SELECT uuid(), id, 'kõrgharidus' FROM category WHERE name = 'HARIDUS'
UNION ALL
SELECT uuid(), id, 'rahvaharidus' FROM category WHERE name = 'HARIDUS';
