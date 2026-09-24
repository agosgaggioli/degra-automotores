const { supabase } = require('../config/supabase');

// GET /api/admin/stats (protegido) - números para el dashboard del backoffice
async function getStats(req, res, next) {
  try {
    const [
      vehiclesPublished,
      vehiclesDraft,
      vehiclesSold,
      consignmentsPending,
      contactNew,
      consignmentsTotal,
      financingsPublished,
    ] =
      await Promise.all([
        supabase.from('vehicles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('vehicles').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('vehicles').select('id', { count: 'exact', head: true }).eq('status', 'sold'),
        supabase.from('consignments').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('consignments').select('id', { count: 'exact', head: true }),
        supabase.from('financings').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      ]);

    return res.json({
      vehicles: {
        published: vehiclesPublished.count || 0,
        draft: vehiclesDraft.count || 0,
        sold: vehiclesSold.count || 0,
      },
      consignments: {
        pending: consignmentsPending.count || 0,
        total: consignmentsTotal.count || 0,
      },
      contact: {
        new: contactNew.count || 0,
      },
      financings: {
        published: financingsPublished.count || 0,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
