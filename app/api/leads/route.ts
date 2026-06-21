import { supabase } from "@/components/lib/supabase";

export async function POST(req: Request) {
  try {
    const { nome, whatsapp, interesse } = await req.json();
    console.log("NOVO LEAD:", {
      nome,
      whatsapp,
      interesse,
    });

    const { error } = await supabase.from("leads").insert([
      {
        nome,
        whatsapp,
        interesse,
      },
    ]);

    if (error) {
      console.error(error);

      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Erro ao salvar lead" }, { status: 500 });
  }
}
