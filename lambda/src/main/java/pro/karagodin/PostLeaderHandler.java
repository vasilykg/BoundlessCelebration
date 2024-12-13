package pro.karagodin;

import com.google.gson.Gson;

import java.util.function.Function;

public class PostLeaderHandler implements Function<Request, Response> {

	private final EntityManager entityManager = new EntityManager(System.getenv("DATABASE"), System.getenv("ENDPOINT"));
	private final Gson gson = new Gson();

	@Override
	public Response apply(Request request) {
		entityManager.postLeader(gson.fromJson(request.body, Leader.class));
		return new Response(200, "");
	}
}
