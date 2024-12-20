package pro.karagodin;

import com.google.gson.Gson;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.function.Function;

public class GetResultHandler implements Function<Request, Response> {

	private final EntityManager entityManager = new EntityManager(System.getenv("DATABASE"), System.getenv("ENDPOINT"));
	private final Gson gson = new Gson();

	@Override
	public Response apply(Request request) {
		Leader leader = entityManager.getLeader(gson.fromJson(new String(Base64.getDecoder().decode(request.body), StandardCharsets.UTF_8), Leader.class));
		return new Response(200, gson.toJson(leader));
	}
}
